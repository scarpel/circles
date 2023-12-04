import { TObject } from "@customTypes/common";
import {
  TConversationInfo,
  TConversationPayload,
  TInitialConversationPayload,
  TMessage,
} from "@customTypes/conversations";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  addConversationToState,
  doInitialConversationsSetup,
  addMessagesToConversation as _addMessagesToConversation,
  getConversation,
} from "./utils/conversations";
import {
  TConversationsDeliverSync,
  TMessageReceiptPayload,
} from "@socket/types";
import { TUser } from "@customTypes/auth";
import { formatMessage } from "@utils/conversations";

export interface ConversationsState {
  conversations: TConversationInfo[];
  focusedConversationSearchKey?: string | null;
  hashedConversations: TObject<TConversationInfo | null>;
  lookupIdToSearchKey: TObject<string>;
}

const initialState: ConversationsState = {
  conversations: [],
  hashedConversations: {},
  focusedConversationSearchKey: null,
  lookupIdToSearchKey: {},
};

export const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    addConversation: (state, action: PayloadAction<TConversationPayload>) => {
      addConversationToState(state, action.payload);
    },
    removeConversation: (
      state,
      action: PayloadAction<TConversationInfo["searchKey"]>
    ) => {
      state.conversations = state.conversations.filter(
        (c) => c.conversation.id !== action.payload
      );

      state.hashedConversations[action.payload] = null;
    },
    addMessagesToConversation: (
      state,
      action: PayloadAction<{
        messages: TMessage[];
        conversationPayload?: TConversationPayload | null;
        user: TUser;
      }>
    ) => {
      const { messages, conversationPayload, user } = action.payload;

      if (!messages.length) return;

      if (
        conversationPayload &&
        !state.lookupIdToSearchKey[conversationPayload.conversation.id]
      ) {
        addConversationToState(state, conversationPayload);
      }

      _addMessagesToConversation(
        state,
        user,
        messages,
        messages[0].conversationId
      );
    },
    setfocusedConversationSearchKey: (
      state,
      action: PayloadAction<TConversationInfo["searchKey"] | null>
    ) => {
      state.focusedConversationSearchKey = action.payload;

      if (action.payload && state.hashedConversations[action.payload]) {
        state.hashedConversations[action.payload]!.numOfUnreadMessages = 0;
      }
    },
    setupInitialConversation(
      state,
      action: PayloadAction<{
        initialConversations: TInitialConversationPayload[];
        user: TUser;
      }>
    ) {
      doInitialConversationsSetup(
        state,
        action.payload.user,
        action.payload.initialConversations
      );
    },
    addReceiptToMessage(
      state,
      action: PayloadAction<TMessageReceiptPayload & { user: TUser }>
    ) {
      const { messageIds, conversationId, receipt, receiptField, user } =
        action.payload;

      const conversation = getConversation(state, conversationId);

      if (!conversation) return;

      messageIds.forEach((messageId) => {
        const messageIndex = conversation.messages.findIndex(
          ({ id }) => id === messageId
        );

        if (messageIndex === -1) return;

        const message = conversation.messages[messageIndex];

        conversation.messages[messageIndex] = formatMessage(
          {
            ...message,
            [receiptField]: [...message[receiptField], receipt],
          },
          user
        );
      });
    },
    syncConversationMessagesDeliver(
      state,
      action: PayloadAction<{
        sync: TConversationsDeliverSync;
        user: TUser;
      }>
    ) {
      const { sync, user } = action.payload;
      const { conversationIds, receipt } = sync;

      conversationIds.forEach((id) => {
        const conversation = getConversation(state, id);

        if (!conversation) return;

        conversation.messages = conversation.messages.map((message) => {
          if (
            message.sender === user.id &&
            !message.deliveredTo.find(({ userId }) => userId === receipt.userId)
          ) {
            message.deliveredTo.push(receipt);
          }

          return message;
        });
      });
    },
  },
});

export const {
  addConversation,
  addMessagesToConversation,
  removeConversation,
  setfocusedConversationSearchKey,
  setupInitialConversation,
  addReceiptToMessage,
  syncConversationMessagesDeliver,
} = conversationsSlice.actions;

export default conversationsSlice.reducer;
