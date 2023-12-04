import { TConversationDocument } from '@schemas/conversation.schema';
import { TMessageDocument } from '@schemas/message.schema';

export enum ReceiptFields {
  DELIVER = 'deliveredTo',
  READ = 'readBy',
}

export type TReceiptFunctionParam = {
  messageId: string;
  username: string;
  receiptField: string;
};

export type TConversationUser = {
  id: string;
  name: string;
  username: string;
};

export type TConversationPayload = {
  conversation: TConversationDocument;
  users: TConversationUser[];
};

export type TReceiptUserBatch = {
  userId: string;
  messageIds: string[];
};

export type TReceiptBatch = {
  conversationId: string;
  batch: TReceiptUserBatch[];
  receiptField: ReceiptFields;
};

export type TReceiptBatchPayload = {
  batches: TReceiptBatch[];
  receipt: TReceipt;
};

export type TReceipt = {
  userId: string;
  at: number;
};
