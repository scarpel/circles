import { authOptions } from "@app/api/auth/[...nextauth]/route";
import ChatNavbar from "@components/ChatNavbar";
import { TLayoutProps } from "@customTypes/common";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function ChatLayout({ children }: TLayoutProps) {
  // Hooks
  const session = await getServerSession(authOptions);

  // Render
  if (!session || !session.user) return redirect("/login");

  return (
    <main className="bg-black w-screen h-screen flex p-5 space-x-5">
      <ChatNavbar className="px-2" user={session.user} />

      <div className="space-x-5 w-full h-full">{children}</div>
    </main>
  );
}
