"use client";

import TextInput from "@components/TextInput";
import React, { useCallback, useMemo, useState } from "react";
import { ISignInFormProps, TSignInForm } from "./types";
import classNames from "classnames";

export default function SignInForm({ className, onSubmit }: ISignInFormProps) {
  // States
  const [values, setValues] = useState<TSignInForm>({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = useMemo(() => values.email && values.password, [values]);

  // Functions
  const updateInputState = useCallback((name: string, value: string) => {
    setValues((values) => ({
      ...values,
      [name]: value,
    }));
  }, []);

  const handleInputChange = (name: keyof typeof values) => (value: string) =>
    updateInputState(name, value);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setIsSubmitting(true);
      e.preventDefault();

      await onSubmit(values);
    } catch (err) {
      console.error("Error on form submit", err);
      setErrorMessage("Invalid credentails!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render
  return (
    <form
      action=""
      className={classNames(
        "flex flex-col w-2/4 max-w-xl bg-white p-10 rounded-2xl space-y-5 items-center",
        className
      )}
      onSubmit={handleSubmit}
    >
      <label htmlFor="email" className="w-full" autoFocus>
        <h3 className="mb-2 ml-5 font-medium sora">E-mail</h3>

        <TextInput
          value={values.email}
          onChange={handleInputChange("email")}
          placeholder="E-mail"
          name="email"
          autoFocus
        />
      </label>
      <label htmlFor="password" className="w-full ">
        <h3 className="mb-2 ml-5 font-medium sora">Password</h3>

        <TextInput
          value={values.password}
          onChange={handleInputChange("password")}
          placeholder="Password"
          name="password"
          type="password"
        />
      </label>
      {errorMessage ? (
        <p className="m-0 p-0 text-red-500 font-medium">{errorMessage}</p>
      ) : null}

      <div className="text-center">
        <button
          className="text-white bg-black w-fit px-4 py-3 rounded-3xl cursor-pointer disabled:opacity-50 disabled:cursor-default"
          type="submit"
          disabled={!isValid || isSubmitting}
        >
          Log in
        </button>

        <div className="mt-3">
          or{" "}
          <a href="/signup" className="underline">
            create an account
          </a>
        </div>
      </div>
    </form>
  );
}
