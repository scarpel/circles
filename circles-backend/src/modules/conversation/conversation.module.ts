import { Module } from '@nestjs/common';
import { CirclesGateway } from '@src/gateways/circles.gateway';
import { ConversationController } from './conversation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@schemas/user.schema';
import { Message, MessageSchema } from '@schemas/message.schema';
import { Conversation, ConversationSchema } from '@schemas/conversation.schema';
import { Relationship, RelationshipSchema } from '@schemas/relationship.schema';
import { ConversationService } from './conversation.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Conversation.name,
        schema: ConversationSchema,
      },
      {
        name: Message.name,
        schema: MessageSchema,
      },
      {
        name: Relationship.name,
        schema: RelationshipSchema,
      },
    ]),
  ],
  providers: [CirclesGateway, ConversationService],
  controllers: [ConversationController],
})
export class ConversationModule {}
