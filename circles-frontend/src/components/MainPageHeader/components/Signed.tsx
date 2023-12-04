"use client";

import routes from "@services/backend/routes";
import { useRouter } from "next/navigation";
import React from "react";
import { ISignedProps } from "../type";
import UserAvatar from "@components/UserAvatar";

export default function Signed({ user }: ISignedProps) {
  const router = useRouter();

  // Render
  return (
    <nav className="space-x-3 flex">
      <button
        className="px-2 py-1 text-white uppercase tracking-widest hover:underline"
        onClick={() => router.push(routes.Main.chat)}
      >
        Chat
      </button>

      <UserAvatar
        className="border-white border-2"
        user={user}
        size="sm"
        showName={false}
      />
    </nav>
  );
}
