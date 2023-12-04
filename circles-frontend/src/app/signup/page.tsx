"use client";

import React from "react";
import { useRouter } from "next/navigation";
import MainPageBase from "@components/MainPageBase";
import SignUpForm from "@components/SignUpForm/SignUpForm";
import { TSignUpForm } from "@components/SignUpForm/types";
import { signUp } from "@services/backend/auth";

export default function SignUp() {
  const router = useRouter();

  const onSubmit = async (form: TSignUpForm) => {
    await signUp(form);
    router.push("/chat");
  };

  // Render
  return (
    <MainPageBase>
      <SignUpForm onSubmit={onSubmit} />
    </MainPageBase>
  );
}
