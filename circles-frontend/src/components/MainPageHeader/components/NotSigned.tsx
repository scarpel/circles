"use client";

import routes from "@services/backend/routes";
import { useRouter } from "next/navigation";
import React from "react";

export default function NotSigned() {
  // Hooks
  const router = useRouter();

  // Render
  return (
    <nav className="space-x-3">
      <button
        className="px-2 py-1 text-white"
        onClick={() => router.push(routes.Main.logIn)}
      >
        Log in
      </button>
      <button
        className="bg-white px-5 py-3 rounded-full"
        onClick={() => router.push(routes.Main.signUp)}
      >
        Sign up
      </button>
    </nav>
  );
}
