import React, { useState } from "react";
import { IChatItemProps } from "../types";
import ChatHeader from "@components/ChatHeader";
import PrivateSideComponent from "@components/ChatHeader/PrivateSideComponent";
import ChatTextInput from "@components/ChatTextInput";
import MessageBlock from "@components/MessageBlock";
import MessagesContainer from "@components/MessagesContainer";

export default function Private({
  conversationPayload,
  messageBlocks,
  sendMessage,
}: IChatItemProps) {
  const [message, setMessage] = useState("");

  // Functions
  const onSendMessage = () => {
    if (!message) return;

    sendMessage(message.trim());
    setMessage("");
  };

  // Render
  return (
    <div className="w-full h-full flex flex-col">
      <ChatHeader
        SideComponent={PrivateSideComponent}
        conversationPayload={conversationPayload}
      />

      <MessagesContainer
        className="flex-grow flex-shrink min-h-0 -mx-4 my-5"
        contentClassName="px-4"
        messages={conversationPayload.messages}
      >
        {messageBlocks.map((block, index) => (
          <MessageBlock key={`${block.id}-${index}`} block={block} />
        ))}
      </MessagesContainer>

      <ChatTextInput
        className="flex-shrink-0"
        value={message}
        onChange={setMessage}
        onSend={onSendMessage}
      />
    </div>
  );
}
