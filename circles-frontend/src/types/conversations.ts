import { RecordStatus, TUserAction } from "./common";

export enum ConversationTypes {
  PRIVATE = "PRIVATE",
  GROUP = "GROUP",
}

export type DeleteTimestamp = {
  userId: string;
  deletedAt: number;
};

export type TConversation = {
  id: string;
  users: string[];
  type: ConversationTypes;
  createdAt: number;
  status: RecordStatus;
  name?: string;
  blockedBy?: string[];
  deleteTimestamps?: DeleteTimestamp[];
  cold?: boolean;
};

export type TConversationUser = {
  id: string;
  name: string;
  username: string;
};

export type TConversationPayload = {
  conversation: TConversation;
  users: TConversationUser[];
};

export type TConversationInfo = {
  conversation: TConversation;
  users: TConversationUser[];
  type: ConversationTypes;
  searchKey: string;
  numOfUnreadMessages: number;
  messages: TMessage[];
};

export type TMessage = {
  content: string;
  conversationId: string;
  id: string;
  sender: string;
  sendAt: number;
  type: string;
  deliveredTo: TUserAction[];
  readBy: TUserAction[];
  recipients: string[];
  read?: boolean;
};

export type TMessageBlock = {
  messages: TMessage[];
  user: TConversationUser;
  myself: boolean;
  id?: string;
};

export type TInitialConversationPayload = {
  conversation: TConversation;
  users: TConversationUser[];
  messages: TMessage[];
};

export enum ReceiptFields {
  DELIVER = "deliveredTo",
  READ = "readBy",
}
