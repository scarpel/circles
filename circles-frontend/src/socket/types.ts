import { TUserAction } from "@customTypes/common";
import {
  ConversationTypes,
  ReceiptFields,
  TMessage,
} from "@customTypes/conversations";

export enum SocketEvents {
  MessagesInitial = "messages:initial",
  MessageSend = "message:send",
  MessageReceive = "message:receive",
  MessageReceived = "message:received",
  MessageDelivered = "message:delivered",
  MessageRead = "message:read",
  MessageReceipt = "message:receipt",
  ConversationsDeliverSync = "conversations:deliver:sync",
  Disconnect = "disconnect",
  ConversationFocus = "conversation:focus",
}

export type TMessageSendParams = {
  conversationId: string;
  type: ConversationTypes;
  content: string;
};

export type TMessageReceivePayload = TMessage;

export type TMessageReceiptPayload = {
  messageIds: string[];
  conversationId: string;
  receipt: TUserAction;
  receiptField: ReceiptFields;
};

export type TConversationsDeliverSync = {
  conversationIds: string[];
  receipt: TUserAction;
};

export type TEventConversationId = {
  id: string;
};

export type TConversationFocusEvent = TEventConversationId;
