import ConversationList from "@components/ConversationList";
import UserSearch from "@components/UserSearch";
import { ICommonComponentProps } from "@customTypes/common";
import { TConversationInfo } from "@customTypes/conversations";
import { setfocusedConversationSearchKey } from "@redux/slices/conversationsSlice";
import { useAppSelector } from "@redux/store";
import classNames from "classnames";
import React, { useMemo } from "react";
import { useDispatch } from "react-redux";

interface IProps extends ICommonComponentProps {}

export default function ChatDashboard({ className }: IProps) {
  // Hooks
  const dispatch = useDispatch();
  const conversations = useAppSelector(
    ({ conversations }) => conversations.hashedConversations
  );

  // States
  const filteredConversations = useMemo(
    () =>
      Object.values(conversations).filter(
        (c) => c && c.messages.length
      ) as TConversationInfo[],
    [conversations]
  );

  // Functions
  const onConversationClick = (conversation: TConversationInfo) => {
    dispatch(setfocusedConversationSearchKey(conversation.searchKey));
  };

  // Render
  return (
    <div className={classNames("chat-container flex flex-col p-5", className)}>
      <UserSearch />

      <ConversationList
        className="mt-4"
        conversations={filteredConversations}
        onClick={onConversationClick}
      />
    </div>
  );
}
