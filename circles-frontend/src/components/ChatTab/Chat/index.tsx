import React, { useMemo } from "react";
import { IChatProps } from "../types";
import { ConversationTypes } from "@customTypes/conversations";
import Private from "./Private";
import Group from "./Group";
import { sortConversationMessages } from "@utils/conversations";
import { useAppSelector } from "@redux/store";

const Components = {
  [ConversationTypes.PRIVATE]: Private,
  [ConversationTypes.GROUP]: Group,
};

export default function Chat({ conversationPayload, ...props }: IChatProps) {
  // States
  const user = useAppSelector(({ auth }) => auth.user);
  const Component = useMemo(
    () => Components[conversationPayload.type],
    [conversationPayload.type]
  );

  const sortedMessages = useMemo(
    () => sortConversationMessages(conversationPayload, user!),
    [conversationPayload.messages]
  );

  return Component ? (
    <Component
      conversationPayload={conversationPayload}
      messageBlocks={sortedMessages}
      {...props}
    />
  ) : null;
}
