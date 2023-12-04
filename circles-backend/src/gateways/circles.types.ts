import { TUserFromToken } from '@modules/auth/types/auth.types';
import { Socket } from 'socket.io';

export interface ISocketWithUser extends Socket {
  user: TUserFromToken;
}

export enum MessageResponseStatus {
  OK = 'OK',
  ERROR = 'ERROR',
}

export enum SocketEvents {
  MessagesInitial = 'messages:initial',
  MessageSend = 'message:send',
  MessageReceive = 'message:receive',
  MessageReceived = 'message:received',
  MessageRead = 'message:read',
  MessageReceipt = 'message:receipt',
  ConversationFocus = 'conversation:focus',
  ConversationDeliverSync = 'conversations:deliver:sync',
}
