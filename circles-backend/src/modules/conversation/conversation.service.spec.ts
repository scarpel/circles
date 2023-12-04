import { Test } from '@nestjs/testing';
import { ConversationService } from './conversation.service';
import { closeMongoInstance, mockMongoRootSetup } from '@test/mongoBootstrap';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { TUserDocument, User, UserSchema } from '@schemas/user.schema';
import {
  Relationship,
  RelationshipSchema,
  RelationshipStatus,
  TRelationshipDocument,
} from '@schemas/relationship.schema';
import {
  Conversation,
  ConversationSchema,
  ConversationTypes,
} from '@schemas/conversation.schema';
import { Message, MessageSchema } from '@schemas/message.schema';
import { RedisService } from '@modules/redis/redis.service';
import { importMockUsers } from '@test/utils';
import { anaMockUser, johnMockUser } from '@test/constants';
import { TObject } from '@src/types/common';
import { Model } from 'mongoose';
import { TUserFromToken } from '@modules/auth/types/auth.types';

describe('ConversationService', () => {
  let service: ConversationService,
    userModel: Model<TUserDocument>,
    relationshipModel: Model<TRelationshipDocument>,
    users: TObject<TUserDocument> = {},
    redis = {
      getJSONFromCache: jest.fn((id: string, func: any) => func()),
    };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        mockMongoRootSetup(),
        MongooseModule.forFeature([
          {
            name: User.name,
            schema: UserSchema,
          },
          {
            name: Relationship.name,
            schema: RelationshipSchema,
          },
          {
            name: Conversation.name,
            schema: ConversationSchema,
          },
          {
            name: Message.name,
            schema: MessageSchema,
          },
        ]),
      ],
      providers: [
        ConversationService,
        {
          provide: RedisService,
          useValue: redis,
        },
      ],
    }).compile();

    service = module.get(ConversationService);
    userModel = module.get(getModelToken(User.name));
    relationshipModel = module.get(getModelToken(Relationship.name));

    const [john, ana] = await importMockUsers(
      [johnMockUser, anaMockUser],
      userModel,
    );
    users = { john, ana };
  });

  afterEach(async () => {
    await closeMongoInstance();
  });

  describe('isUserRelationshipValid()', () => {
    it('should return true on empty relationships', async () => {
      const value = await service.isUserRelationshipValid(
        users.john.id,
        users.ana.id,
      );

      expect(value).toBeTruthy();
    });
  });

  describe('validateUsersRelationship()', () => {
    it('should return true on valid relationships', async () => {
      const value = await service.validateUsersRelationship(
        users.john.id,
        users.ana.id,
      );

      expect(value).toBeTruthy();
    });

    it('should return false on invalid relationships', async () => {
      await new relationshipModel({
        fromUser: users.john.id,
        toUser: users.ana.id,
        status: RelationshipStatus.BLOCKED,
      }).save();

      const value = await service.validateUsersRelationship(
        users.john.id,
        users.ana.id,
      );

      expect(value).toBeFalsy();
    });
  });

  describe('createConversation()', () => {
    it('should create a private conversation', async () => {
      const conversation = await service.createConversation(
        users.john as TUserFromToken,
        {
          users: [users.ana.id],
          type: ConversationTypes.PRIVATE,
        },
      );

      expect(Object.keys(conversation).sort()).toEqual([
        'conversation',
        'users',
      ]);
      expect(conversation.users.length).toBe(1);
      expect(conversation.users[0].username).toBe(anaMockUser.username);
    });

    it('should return the same private conversation for two users', async () => {
      const conversation = await service.createConversation(
        users.john as TUserFromToken,
        {
          users: [users.ana.id],
          type: ConversationTypes.PRIVATE,
        },
      );

      const newConversation = await service.createConversation(
        users.john as TUserFromToken,
        {
          users: [users.ana.id],
          type: ConversationTypes.PRIVATE,
        },
      );

      expect(conversation.conversation.id).toBe(
        newConversation.conversation.id,
      );
    });
  });
});
