import React, { useMemo } from "react";
import { IMessageBlockProps } from "./types";
import classNames from "classnames";
import Message from "./Message";

export default function MessageBlock({ block }: IMessageBlockProps) {
  // States
  const { messages, myself } = block;

  const className = useMemo(
    () => (myself ? "items-end" : "items-start"),
    [myself]
  );

  // Render
  return (
    <div
      className={classNames("message-block w-full", {
        myself: true,
      })}
    >
      <section className={classNames("flex flex-col space-y-1", className)}>
        {messages.map((message, index) => (
          <Message
            key={`${message.id}-${index}`}
            message={message}
            isSender={myself}
          />
        ))}
      </section>
    </div>
  );
}
