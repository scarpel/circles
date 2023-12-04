import {
  TConversation,
  TConversationPayload,
  TInitialConversationPayload,
  TMessage,
} from "@customTypes/conversations";
import { ConversationsState } from "../conversationsSlice";
import { formatConversation, formatMessage } from "@utils/conversations";
import { groupObjectByKey, sortByKey } from "@utils/sort";
import { TUser } from "@customTypes/auth";
import { getLastItem } from "@utils/array";

export function getConversation(
  state: ConversationsState,
  conversationId: TConversation["id"]
) {
  return state.hashedConversations[state.lookupIdToSearchKey[conversationId]];
}

export function addConversationToState(
  state: ConversationsState,
  conversationPayload: TConversationPayload
) {
  const conversation = formatConversation(conversationPayload);

  state.conversations.push(conversation);
  state.hashedConversations[conversation.searchKey] = conversation;
  state.lookupIdToSearchKey[conversation.conversation.id] =
    conversation.searchKey;
}

export function getNumberOfUnreadMessages(user: TUser, messages: TMessage[]) {
  if (getLastItem(messages).sender === user.id) return 0;

  return messages.filter((m) => m.sender !== user.id && !m.read).length;
}

export function addMessageToConversation(
  state: ConversationsState,
  user: TUser,
  messages: TMessage[],
  conversation?: TConversationPayload | null
) {
  if (
    conversation &&
    !state.lookupIdToSearchKey[conversation.conversation.id]
  ) {
    addConversationToState(state, conversation);
  }

  const sortedMessages = groupObjectByKey(messages, "conversationId");

  Object.keys(sortedMessages).forEach((id) => {
    const messages = sortedMessages[id],
      conversation = state.hashedConversations[state.lookupIdToSearchKey[id]];

    if (!conversation) return;

    conversation.messages = sortByKey(
      conversation.messages.concat(messages),
      "sentAt"
    ) as TMessage[];

    if (conversation.searchKey !== state.focusedConversationSearchKey)
      conversation.numOfUnreadMessages += messages.filter(
        (m) =>
          m.sender !== user.id &&
          !m.deliveredTo.find(({ userId }) => userId === user.id)
      ).length;
  });
}

export function addMessagesToConversation(
  state: ConversationsState,
  user: TUser,
  messages: TMessage[],
  conversationId: TConversation["id"]
) {
  const storedConversation =
    state.hashedConversations[state.lookupIdToSearchKey[conversationId]]!;

  if (!storedConversation) return;

  const formattedMessages = messages.map((message) =>
    formatMessage(message, user)
  );

  storedConversation.messages = sortByKey(
    storedConversation.messages.concat(formattedMessages),
    "sentAt"
  ) as TMessage[];

  if (storedConversation.searchKey !== state.focusedConversationSearchKey) {
    storedConversation.numOfUnreadMessages += getNumberOfUnreadMessages(
      user,
      formattedMessages
    );
  }
}

export function doInitialConversationsSetup(
  state: ConversationsState,
  user: TUser,
  conversations: TInitialConversationPayload[]
) {
  conversations.forEach(({ conversation, users, messages }) => {
    addConversationToState(state, {
      conversation: {
        ...conversation,
        cold: true,
      },
      users,
    });

    addMessagesToConversation(state, user, messages, conversation.id);
  });
}
