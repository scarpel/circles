import React, { useMemo } from "react";
import { IConversationListProps } from "./types";
import classNames from "classnames";
import ConversationListItem from "./Item";
import NoItems from "./NoItems";

export default function ConversationList({
  conversations,
  className,
  onClick,
}: IConversationListProps) {
  const hasConversations = useMemo(
    () => !!conversations.length,
    [conversations]
  );

  // Render
  const renderContent = () => {
    if (!hasConversations) return <NoItems />;

    return conversations.map((conversation) => (
      <ConversationListItem
        key={conversation.conversation.id}
        conversation={conversation}
        onClick={() => onClick(conversation)}
      />
    ));
  };

  return (
    <section className={classNames("flex-grow-1 h-full", className)}>
      {renderContent()}
    </section>
  );
}
