import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Conversation } from './conversation.schema';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';
import { TUserAction } from '@src/types/schemas';

export enum MessageTypes {
  TEXT = 'TEXT',
  MEDIA = 'MEDIA',
}

@Schema()
export class Message {
  @Prop({ type: Types.ObjectId, ref: Conversation.name, required: true })
  conversationId: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  sender: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }], required: true })
  recipients: [string];

  @Prop({ required: true })
  sentAt: number;

  @Prop({ required: true })
  content: string;

  @Prop({ default: MessageTypes.TEXT, required: true })
  type: MessageTypes;

  @Prop({
    default: [],
  })
  readBy: [TUserAction];

  @Prop({
    default: [],
  })
  deliveredTo: [TUserAction];
}

export type TMessageDocument = Message & Document;

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.id = ret._id;

    delete ret._id;
    delete ret.__v;
  },
});
