import React from "react";
import { IChatHeaderSideComponentProps } from "./types";
import UserAvatar from "@components/UserAvatar";

export default function PrivateSideComponent({
  conversationPayload: { users },
}: IChatHeaderSideComponentProps) {
  // States
  const recipient = users[0];

  // Render
  return (
    <div className="flex items-center">
      <UserAvatar user={recipient} showName={false} />

      <section className="ml-3">
        <h2 className="font-medium text-xl m-0 p-0">{recipient.name}</h2>
        <p className="m-0 p-0 text-sm opacity-30">{recipient.username}</p>
      </section>
    </div>
  );
}
