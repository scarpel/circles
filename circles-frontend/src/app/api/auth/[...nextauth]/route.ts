import { TSignInPayload, TUser } from "@customTypes/auth";
import { TObject } from "@customTypes/common";
import moment from "moment";
import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

let storedRefreshTokens: TObject<TSignInPayload> = {};

async function doRefreshToken(refreshToken: string) {
  try {
    if (!refreshToken) throw new Error();

    const response = await fetch(
      `${process.env.SERVER_BACKEND_URL}/auth/refresh`!,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken,
        }),
      }
    );

    if (!response.ok) throw new Error();

    return (await response.json()) as TSignInPayload;
  } catch (err) {
    console.error("Unable to refresh token!", err);

    return null;
  }
}

export const authOptions: AuthOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "E-mail",
          placeholder: "example@example.com",
          type: "text",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          storedRefreshTokens = {};

          const response = await fetch(
            `${process.env.SERVER_BACKEND_URL}/auth/signin`!,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(credentials ?? {}),
              credentials: "include",
            }
          );

          if (!response.ok) return null;

          return (await response.json()) as any;
        } catch (err) {
          console.error(err);
          throw err;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const {
          user: userInfo,
          accessToken,
          refreshToken,
          accessTokenExpiration,
        } = user as any as TSignInPayload;

        token.user = userInfo;
        token.accessToken = accessToken;
        token.refreshToken = refreshToken;
        token.accessTokenExpiration = accessTokenExpiration;

        return token;
      }

      if ((token.accessTokenExpiration as number) * 0.8 < moment().unix()) {
        const refresh =
          storedRefreshTokens[token.accessToken as string] ||
          (await doRefreshToken(token.refreshToken as string));

        if (!refresh) return {};

        storedRefreshTokens[token.accessToken as string] = refresh;

        return refresh;
      }

      return token;
    },
    async session({ session, token }) {
      if (!(token.accessToken && token.user)) {
        storedRefreshTokens = {};
        throw new Error("Invalid token!");
      }

      if (token) {
        const { user, accessToken, accessTokenExpiration } = token;

        session.accessToken = accessToken as string;
        session.user = user as TUser;
        session.expires = accessTokenExpiration as string;
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
