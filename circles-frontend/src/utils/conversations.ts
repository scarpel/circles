import { TUser } from "@customTypes/auth";
import {
  ConversationTypes,
  TConversationInfo,
  TConversationPayload,
  TMessage,
  TMessageBlock,
} from "@customTypes/conversations";
import { groupObjectByKey } from "./sort";

export function getSearchKeyFromConversation(
  conversation: TConversationPayload
) {
  return conversation.conversation.type === ConversationTypes.PRIVATE
    ? conversation.users[0].id
    : conversation.conversation.id;
}

export function formatConversation(conversation: TConversationPayload) {
  const searchKey = getSearchKeyFromConversation(conversation);

  return {
    ...conversation,
    searchKey,
    type: conversation.conversation.type,
    numOfUnreadMessages: 0,
    messages: [],
  } as TConversationInfo;
}

export function formatMessage(message: TMessage, { id }: TUser) {
  return {
    ...message,
    read:
      message.sender === id
        ? message.readBy.length === message.recipients.length - 1
        : !!message.readBy.find(({ userId }) => userId === id),
  } as TMessage;
}

export function addIdToMessageBlock(block: TMessageBlock) {
  block.id = block.messages[0]?.id;

  return block;
}

export function sortConversationMessages(
  conversation: TConversationInfo,
  user: TUser
) {
  const { users = [] } = conversation;

  const blocks: TMessageBlock[] = [],
    groupedUsers = groupObjectByKey(users.concat(user), "id");
  let currentBlock: TMessageBlock, currentUser: string;

  conversation.messages.forEach((message) => {
    if (message.sender !== currentUser) {
      if (currentBlock) {
        blocks.push(addIdToMessageBlock(currentBlock));
      }

      currentBlock = {
        messages: [],
        myself: message.sender === user.id,
        user: groupedUsers[message.sender][0],
      };
      currentUser = message.sender;
    }

    currentBlock.messages.push(message);
  });

  if (currentBlock!) {
    blocks.push(addIdToMessageBlock(currentBlock));
  }

  return blocks;
}
