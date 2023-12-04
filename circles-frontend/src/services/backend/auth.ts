import { TSignUpForm } from "@components/SignUpForm/types";
import { BackendFetcher } from ".";
import routes, { mergePaths } from "./routes";

export async function signIn(email: string, password: string) {
  return fetch("auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export async function signUp(form: TSignUpForm) {
  return BackendFetcher.post(routes.Auth.signUp, form);
}
