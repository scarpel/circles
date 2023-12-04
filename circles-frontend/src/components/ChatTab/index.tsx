"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { IChatTabProps } from "./types";
import classNames from "classnames";
import withConversation from "@src/hoc/withConversation";
import Error from "./Error";
import Loading from "./Loading";
import Chat from "./Chat";
import { socketClient } from "@socket/client";
import {
  SocketEvents,
  TConversationFocusEvent,
  TMessageSendParams,
} from "@socket/types";

function ChatTab({
  className,
  conversationPayload,
  hasError,
  isLoading,
}: IChatTabProps) {
  // Refs
  const lastConversationId = useRef("");

  // States
  const conversationId = conversationPayload?.conversation.id;

  // Effects
  useEffect(() => {
    if (!conversationId || lastConversationId.current === conversationId)
      return;

    socketClient.emitEvent(SocketEvents.ConversationFocus, {
      id: conversationId,
    } as TConversationFocusEvent);

    lastConversationId.current = conversationId;
  }, [conversationId]);

  // Functions
  const sendMessage = (content: string) => {
    socketClient.emitEvent(SocketEvents.MessageSend, {
      content,
      conversationId,
    } as TMessageSendParams);
  };

  // Render
  const Content = useMemo(() => {
    if (hasError) return Error;

    if (isLoading) return Loading;

    return Chat;
  }, [isLoading, hasError]);

  return (
    <div className={classNames("chat-container p-5 flex-center", className)}>
      <Content
        conversationPayload={conversationPayload!}
        sendMessage={sendMessage}
      />
    </div>
  );
}

export default withConversation<IChatTabProps>(ChatTab);
