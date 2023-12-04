import {
  Injectable,
  Logger,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { getUserInfoFromRequest } from '@utils/token';
import { Server, Socket } from 'socket.io';
import { TObject } from '@src/types/common';
import { WsUserExtractorInterceptor } from '@interceptors/ws-user-extractor.interceptor copy';
import {
  ISocketWithUser,
  MessageResponseStatus,
  SocketEvents,
} from './circles.types';
import { ConversationService } from '@modules/conversation/conversation.service';
import { ConversationMessageDto } from './dtos/conversation-message.dto copy';
import { MessageReceivedDto } from './dtos/message-received.dto';
import { ReceiptFields } from '@modules/conversation/conversation.types';
import { convertObjectIdToString } from '@utils/string';
import moment from 'moment';
import { MessageReadDto } from './dtos/message-read.dto';
import { TUserFromToken } from '@modules/auth/types/auth.types';
import { ConversationFocusDto } from './dtos/conversation-focus.dto';

@Injectable()
@UsePipes(new ValidationPipe())
@UseInterceptors(WsUserExtractorInterceptor)
@WebSocketGateway({ cors: true })
export class CirclesGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  users: TObject<string> = {};
  rooms: TObject<string[]> = {};

  constructor(
    private jwtService: JwtService,
    private readonly conversationService: ConversationService,
  ) {}

  // Connection
  handleConnection(client: Socket) {
    const user = getUserInfoFromRequest(
      client.handshake as any,
      this.jwtService,
    );

    if (!user) return client.disconnect();

    this.users[user.id] = client.id;

    client.join(user.id);

    return true;
  }

  // Receipt
  async applyReceipt(
    user: TUserFromToken,
    messageId: string,
    receiptField: ReceiptFields,
  ) {
    try {
      const { message, receipt } =
        await this.conversationService.addReceiptToMessage(
          user,
          messageId,
          receiptField,
        );

      this.server.to(message.sender).emit(
        SocketEvents.MessageReceipt,
        this.conversationService.makeMessageReceiptEventPayload({
          messageIds: [messageId],
          conversationId: message.conversationId,
          receipt,
          receiptField,
        }),
      );

      return {
        status: MessageResponseStatus.OK,
        receipt,
      };
    } catch (err) {
      Logger.error('Unable to apply receipt message', err, {
        user,
        messageId,
        receiptField,
      });

      return {
        status: MessageResponseStatus.ERROR,
        message: err.message || err.name,
      };
    }
  }

  // Subscriptions
  @SubscribeMessage(SocketEvents.MessagesInitial)
  async getInitialMessages(client: ISocketWithUser) {
    const at = moment().unix();

    const conversations =
      await this.conversationService.getConversationsFromUser(client.user, at);

    const deliverSyncEvents =
        this.conversationService.makeDeliverSyncEventsPayload(conversations),
      receipt = this.conversationService.makeReceipt(client.user, at);

    Object.keys(deliverSyncEvents).forEach((userId) =>
      this.server.to(userId).emit(SocketEvents.ConversationDeliverSync, {
        ...deliverSyncEvents[userId],
        receipt,
      }),
    );

    return conversations;
  }

  @SubscribeMessage(SocketEvents.MessageSend)
  async sendMessage(client: ISocketWithUser, data: ConversationMessageDto) {
    try {
      const message = await this.conversationService.sendMessage(
        client.user,
        data,
      );

      this.server
        .to(convertObjectIdToString(message.recipients))
        .emit(SocketEvents.MessageReceive, message);
    } catch (err) {
      Logger.error('Unable to send message', err);
    }
  }

  @SubscribeMessage(SocketEvents.MessageReceived)
  async handleMessageReceived(
    client: ISocketWithUser,
    { id }: MessageReceivedDto,
  ) {
    await this.applyReceipt(client.user, id, ReceiptFields.DELIVER);
  }

  @SubscribeMessage(SocketEvents.MessageRead)
  async handleMessageRead(client: ISocketWithUser, { id }: MessageReadDto) {
    await this.applyReceipt(client.user, id, ReceiptFields.READ);
  }

  @SubscribeMessage(SocketEvents.ConversationFocus)
  async handleConversationFocus(
    client: ISocketWithUser,
    { id }: ConversationFocusDto,
  ) {
    const values = await this.conversationService.onConversationFocus(
      client.user,
      id,
    );

    if (!values) return;

    const { batches, receipt } = values;

    batches.forEach(({ batch, conversationId, receiptField }) => {
      batch.forEach(({ messageIds, userId }) =>
        this.server.to(userId).emit(
          SocketEvents.MessageReceipt,
          this.conversationService.makeMessageReceiptEventPayload({
            conversationId,
            messageIds,
            receipt,
            receiptField,
          }),
        ),
      );
    });
  }
}
