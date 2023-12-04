"use client";

import React from "react";
import SignInForm from "@components/SignInForm/SignInForm";
import { TSignInForm } from "@components/SignInForm/types";
import { signIn } from "next-auth/react";
import { ResponseCodeError } from "@src/errors/ResponseCodeError";
import { useRouter } from "next/navigation";
import MainPageBase from "@components/MainPageBase";

export default function SignIn() {
  const router = useRouter();

  const onSubmit = async ({ email, password }: TSignInForm) => {
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/chat",
    });

    if (res?.error) throw new ResponseCodeError(res.status, res.error);

    router.push("/chat");
  };

  // Render
  return (
    <MainPageBase>
      <SignInForm onSubmit={onSubmit} />
    </MainPageBase>
  );
}
