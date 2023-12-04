import React, { useMemo } from "react";
import { IConversationListItemProps } from "../types";
import UserAvatar from "@components/UserAvatar";
import { getLastItem } from "@utils/array";
import moment from "moment";
import { useAppSelector } from "@redux/store";
import NotificationCounter from "@components/NotificationCounter";

import { FiCheck } from "react-icons/fi";
import MessageReceipt from "@components/MessageReceipt";

export default function PrivateConversation({
  conversation,
  onClick,
}: IConversationListItemProps) {
  // States
  const user = useAppSelector(({ auth }) => auth.user);

  const {
    recipient,
    lastMessage,
    lastMessageTime,
    wasLastMsgMine,
    numOfUnreadMessages,
  } = useMemo(() => {
    const lastMessage = getLastItem(conversation.messages);

    return {
      recipient: conversation.users[0],
      lastMessage,
      lastMessageTime: lastMessage
        ? moment(lastMessage.sendAt).format("HH:mm")
        : null,
      numOfUnreadMessages: conversation.numOfUnreadMessages,
      wasLastMsgMine: lastMessage?.sender === user?.id,
    };
  }, [conversation]);

  // Render
  return (
    <div
      className="flex min-w-0 items-center cursor-pointer hover:border-black-500 hover:bg-black-100 p-2 transition-all border border-transparent rounded-xl"
      role="button"
      onClick={onClick}
    >
      <div className="relative">
        {wasLastMsgMine ? null : (
          <NotificationCounter
            className="absolute -top-1.5 -right-1.5"
            numberOfNotification={numOfUnreadMessages}
          />
        )}

        <UserAvatar
          user={recipient}
          showName={false}
          size="md"
          withAnimation={false}
        />
      </div>

      <section className="ml-3 flex-grow flex-shrink-1 min-w-0">
        <h3 className="font-medium text-lg truncate">{recipient.username}</h3>

        <section className="flex text-sm text-black-500 items-center">
          {wasLastMsgMine && <MessageReceipt message={lastMessage} />}

          <p className="text-sm truncate flex-grow">{lastMessage.content}</p>

          {lastMessageTime ? (
            <time className="ml-3 font-medium flex-shrink-0">
              {lastMessageTime}
            </time>
          ) : null}
        </section>
      </section>
    </div>
  );
}
