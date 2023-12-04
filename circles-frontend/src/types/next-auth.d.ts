import { TUser } from "./auth";

declare module "next-auth" {
  interface Session {
    user: TUser;
    accessToken: string;
  }
}
