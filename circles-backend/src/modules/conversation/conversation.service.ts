import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TUserDocument, User } from '@schemas/user.schema';
import { Model, isValidObjectId } from 'mongoose';
import { TUserFromToken } from '@modules/auth/types/auth.types';
import { Message, TMessageDocument } from '@schemas/message.schema';
import moment from 'moment';
import {
  Relationship,
  RelationshipStatus,
  TRelationshipDocument,
} from '@schemas/relationship.schema';
import {
  Conversation,
  ConversationTypes,
  TConversationDocument,
} from '@schemas/conversation.schema';
import { sortAlphabetically } from '@utils/string';
import { RecordStatus, TUserAction } from '@src/types/schemas';
import { ConversationMessageDto } from '@src/gateways/dtos/conversation-message.dto copy';
import NotInConversationError from '@errors/NotInConversationError';
import { MissingDocumentError } from '@errors/MissingDocumentError';
import { RedisService } from '@modules/redis/redis.service';
import { filterTruthy } from '@utils/filter';
import {
  ReceiptFields,
  TConversationPayload,
  TReceipt,
  TReceiptBatch,
  TReceiptBatchPayload,
  TReceiptUserBatch,
} from './conversation.types';
import { sortByKey } from '@utils/sort';
import { TObject } from '@src/types/common';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<TUserDocument>,
    @InjectModel(Relationship.name)
    private readonly relationshipModel: Model<TRelationshipDocument>,
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<TConversationDocument>,
    @InjectModel(Message.name)
    private readonly messageModel: Model<TMessageDocument>,
    private readonly redisService: RedisService,
  ) {}

  async validateUser(userId: string) {
    return !!(await this.userModel.findById(userId));
  }

  async validateUsers(userIds: string[]) {
    return Promise.all(
      userIds.map((userId) => this.validateUser(userId).catch(() => false)),
    ).then((values) => values.every((v) => v));
  }

  async isUserRelationshipValid(originalUserId: string, otherUserId: string) {
    const status = (
      await this.relationshipModel.findOne({
        fromUser: originalUserId,
        toUser: otherUserId,
      })
    )?.status;

    return !status || status === RelationshipStatus.ACTIVE;
  }

  async validateUsersRelationship(userA: string, userB: string) {
    return (
      await Promise.all([
        this.isUserRelationshipValid(userA, userB),
        this.isUserRelationshipValid(userB, userA),
      ])
    ).every((value) => value);
  }

  async validateMultipleUsersRelationship(
    originalUserId: string,
    users: string[],
  ) {
    return (
      await Promise.all(
        users.map((userId) =>
          userId !== originalUserId
            ? this.validateUsersRelationship(originalUserId, userId)
            : true,
        ),
      )
    ).every((value) => value);
  }

  async hasPrivateConversationAlreadyBeenCreated(users: string[]) {
    return !!(await this.conversationModel.findOne({
      users: sortAlphabetically(users),
      type: ConversationTypes.PRIVATE,
    }));
  }

  async isConversationValid(users: string[], type: ConversationTypes) {
    if (type !== ConversationTypes.PRIVATE) return true;

    return !(await this.hasPrivateConversationAlreadyBeenCreated(users));
  }

  async getConversationBasedOnUsersAndType(
    users: string[],
    type: ConversationTypes,
  ) {
    return this.conversationModel.findOne({
      users: sortAlphabetically(users),
      type,
    });
  }

  async usernameToId(username: string) {
    if (isValidObjectId(username)) return username;

    const user = await this.userModel.findOne({ username });

    if (!user) throw new MissingDocumentError('User with username not found!');

    return user?.id;
  }

  async usernamesToIds(usernames: string[]) {
    return Promise.all(
      usernames.map((username) => this.usernameToId(username)),
    );
  }

  async getUserFromConversation(userId: string) {
    return this.redisService.getJSONFromCache(
      `conversation-user:${userId}`,
      () =>
        this.userModel
          .findById(userId)
          .then(({ id, name, username }) => ({ id, name, username }))
          .catch(() => null),
    );
  }

  async getUsersFromConversation(user: TUserFromToken, userIds: string[]) {
    return Promise.all(
      userIds
        .filter((id) => id.toString() !== user.id)
        .map((value) => this.getUserFromConversation(value)),
    ).then((values) => filterTruthy(values));
  }

  async formatConversation(
    user: TUserFromToken,
    conversation: TConversationDocument,
  ) {
    const conversationUsers = await this.getUsersFromConversation(
      user,
      conversation.users,
    );

    return {
      conversation,
      users: conversationUsers,
    };
  }

  async createConversation(
    user: TUserFromToken,
    conversationInfo: {
      users: string[];
      type: ConversationTypes;
      name?: string;
    },
  ) {
    const users = sortAlphabetically(
      await this.usernamesToIds([user.id, ...conversationInfo.users]),
    );

    if (!(await this.validateMultipleUsersRelationship(user.id, users)))
      throw new Error('Invalid users!');

    let conversation: TConversationDocument;

    // Check for old private conversation
    if (conversationInfo.type === ConversationTypes.PRIVATE) {
      conversation = await this.getConversationBasedOnUsersAndType(
        users,
        conversationInfo.type,
      );
    }

    if (!conversation) {
      const conversationModel = new this.conversationModel({
        ...conversationInfo,
        users: users as any,
        createdAt: moment().unix(),
        status: RecordStatus.ACTIVE,
        blockedBy: [] as any,
        deleteTimestamps: [],
      } as Conversation);

      conversation = await conversationModel.save();
    }

    return this.formatConversation(user, conversation);
  }

  async getConversationById(id: string) {
    return await this.conversationModel.findById(id);
  }

  canUserSendMessageToConversation(
    userId: string,
    conversation: TConversationDocument,
  ) {
    return (
      conversation.users.includes(userId as any) &&
      !conversation.blockedBy.includes(userId)
    );
  }

  generateMessageRecipients({
    users = [],
    blockedBy = [],
  }: TConversationDocument) {
    return !blockedBy.length
      ? users
      : users.filter((user) => !blockedBy.includes(user));
  }

  makeReceipt(user: TUserFromToken, at: number = moment().unix()) {
    return { userId: user.id, at };
  }

  makeMessagePayload(
    user: TUserFromToken,
    conversation: TConversationDocument,
    { content = '', conversationId, type }: ConversationMessageDto,
  ) {
    return {
      type,
      content: content.trim(),
      conversationId,
      deliveredTo: [] as any,
      readBy: [] as any,
      sender: user.id,
      recipients: this.generateMessageRecipients(conversation),
      sentAt: moment().unix(),
    } as Message;
  }

  async sendMessage(user: TUserFromToken, payload: ConversationMessageDto) {
    const conversation = await this.getConversationById(payload.conversationId);

    if (!this.canUserSendMessageToConversation(user.id, conversation))
      throw new NotInConversationError(payload.conversationId);

    const message = new this.messageModel(
      this.makeMessagePayload(user, conversation, payload),
    );

    await this.redisService.deleteMatches(`${payload.conversationId}:focus:*`);

    return await message.save();
  }

  async getActiveConversationsFromUserId(user: TUserFromToken) {
    const conversations = await this.conversationModel.find({
      users: user.id,
      status: RecordStatus.ACTIVE,
    });

    return Promise.all(
      conversations.map((c) => this.formatConversation(user, c)),
    );
  }

  async getLastMessagesFromConversation(
    user: TUserFromToken,
    conversation: TConversationPayload,
    limit: number = 3,
    at: number,
  ) {
    try {
      const firstUnreadMessage = await this.messageModel
        .findOne({
          conversationId: conversation.conversation.id,
          sender: { $ne: user.id },
          'readBy.userId': { $ne: user.id },
        })
        .sort({ sentAt: 1 });

      if (!firstUnreadMessage) {
        return await this.messageModel
          .find()
          .sort({ sentAt: -1 })
          .limit(limit)
          .then((messages) => sortByKey(messages, 'sentAt'));
      }

      const unreadMessages = await this.messageModel
        .find({
          sentAt: { $gte: firstUnreadMessage.sentAt },
        })
        .sort({ sendAt: 1 });

      return this.applyDelivedReciptToMessages(user, unreadMessages, at);
    } catch (err) {
      Logger.error('Unable to get messages from conversation', err);
      return [];
    }
  }

  async getUnreadMessagesFromConversation(
    userId: string,
    conversationId: string,
  ) {
    return this.messageModel.find({
      conversationId,
      sender: { $ne: userId },
      'readBy.userId': { $ne: userId },
    });
  }

  async getConversationsInfo(
    user: TUserFromToken,
    conversations: TConversationPayload[],
    at: number,
  ) {
    return Promise.all(
      conversations.map((conversation) =>
        this.getLastMessagesFromConversation(user, conversation, 3, at).then(
          (messages) => ({
            ...conversation,
            messages,
          }),
        ),
      ),
    );
  }

  async getConversationsFromUser(
    user: TUserFromToken,
    at: number = moment().unix(),
  ) {
    return this.getActiveConversationsFromUserId(user).then((conversations) =>
      this.getConversationsInfo(user, conversations, at),
    );
  }

  async _addReceiptToMessage(
    user: TUserFromToken,
    message: TMessageDocument,
    field: ReceiptFields,
    at: number,
  ) {
    let receipt = (message[field] as TUserAction[]).find(
      ({ userId }) => userId === user.id,
    );

    if (!receipt) {
      receipt = this.makeReceipt(user, at);

      message[field].push(receipt);

      await message.save();
    }

    return {
      message,
      receipt,
    };
  }

  async addReceiptToMessage(
    user: TUserFromToken,
    messageId: string,
    field: ReceiptFields,
    at: number = moment().unix(),
  ) {
    const message = await this.messageModel.findById(messageId);

    if (!message)
      throw new MissingDocumentError(
        'Message with informed ID not found!',
        messageId,
      );

    if (!message.recipients.includes(user.id))
      throw new NotInConversationError(message.conversationId);

    return await this._addReceiptToMessage(user, message, field, at);
  }

  async applyReceiptToMessageDocuments(
    user: TUserFromToken,
    messages: TMessageDocument[],
    receiptField: ReceiptFields,
    at: number = moment().unix(),
  ) {
    return Promise.all(
      messages.map((message) =>
        message.sender === user.id
          ? message
          : this._addReceiptToMessage(user, message, receiptField, at).then(
              ({ message }) => message,
            ),
      ),
    );
  }

  async applyDelivedReciptToMessages(
    user: TUserFromToken,
    messages: TMessageDocument[],
    at: number = moment().unix(),
  ) {
    return this.applyReceiptToMessageDocuments(
      user,
      messages,
      ReceiptFields.DELIVER,
      at,
    );
  }

  async applyReadReceiptToMessages(
    user: TUserFromToken,
    messages: TMessageDocument[],
    at: number = moment().unix(),
  ) {
    return this.applyReceiptToMessageDocuments(
      user,
      messages,
      ReceiptFields.READ,
      at,
    );
  }

  makeDeliverSyncEventsPayload(
    conversationsInfo: Awaited<
      ReturnType<typeof this.getConversationsFromUser>
    >,
  ) {
    const usersInfo = {};

    conversationsInfo.forEach(({ users, conversation }) => {
      users.forEach((user) => {
        if (!(user.id in usersInfo))
          usersInfo[user.id] = {
            conversationIds: [],
          };

        usersInfo[user.id].conversationIds.push(conversation.id);
      });
    });

    return usersInfo;
  }

  makeReceiptBatchPayload({
    user,
    receipt,
    receiptBatches,
    receiptField,
  }: {
    user: TUserFromToken;
    receiptBatches: { conversationId: string; messages: TMessageDocument[] }[];
    receipt: TReceipt;
    receiptField: ReceiptFields;
    includeUser?: boolean;
  }) {
    const batches: TReceiptBatch[] = [];

    receiptBatches.forEach(({ conversationId, messages }) => {
      const batch = messages.reduce((batch, { id, sender }) => {
        if (sender === user.id) return batch;

        if (!(sender in batch))
          batch[sender] = { userId: sender, messageIds: [] };

        batch[sender].messageIds.push(id);

        return batch;
      }, {} as TObject<TReceiptUserBatch>);

      const batchValues = Object.values(batch);

      if (batchValues.length) {
        batches.push({
          conversationId,
          batch: batchValues,
          receiptField,
        });
      }
    });

    return {
      batches,
      receipt,
    } as TReceiptBatchPayload;
  }

  async applyReadToUnreadMessagesFromConversation(
    user: TUserFromToken,
    conversationId: string,
  ) {
    const receipt = this.makeReceipt(user);

    const readMessages = await this.applyReadReceiptToMessages(
      user,
      await this.getUnreadMessagesFromConversation(user.id, conversationId),
      receipt.at,
    );

    return this.makeReceiptBatchPayload({
      user,
      receipt,
      receiptBatches: [
        {
          conversationId,
          messages: readMessages,
        },
      ],
      receiptField: ReceiptFields.READ,
    });
  }

  async onConversationFocus(user: TUserFromToken, conversationId: string) {
    return this.redisService.memo({
      key: `${conversationId}:focus:${user.id}`,
      execute: () =>
        this.applyReadToUnreadMessagesFromConversation(user, conversationId),
      options: { EX: moment().add(3, 'days').get('seconds') },
    });
  }

  makeMessageReceiptEventPayload({
    conversationId,
    messageIds,
    receipt,
    receiptField,
  }: {
    conversationId: string;
    messageIds: string[];
    receiptField: ReceiptFields;
    receipt: TReceipt;
  }) {
    return {
      conversationId,
      messageIds,
      receiptField,
      receipt,
    };
  }
}
