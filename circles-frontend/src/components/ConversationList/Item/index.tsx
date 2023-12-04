import React, { useMemo } from "react";
import { IConversationListItemProps } from "../types";
import { ConversationTypes } from "@customTypes/conversations";
import PrivateConversation from "./PrivateConversation";
import GroupConversation from "./GroupConversation";

const ItemComponents = {
  [ConversationTypes.PRIVATE]: PrivateConversation,
  [ConversationTypes.GROUP]: GroupConversation,
};

export default function ConversationListItem(
  props: IConversationListItemProps
) {
  const Component = useMemo(() => {
    if (!props.conversation.messages.length) return null;

    return ItemComponents[props.conversation.type];
  }, [props.conversation]);

  return Component ? <Component {...props} /> : null;
}
