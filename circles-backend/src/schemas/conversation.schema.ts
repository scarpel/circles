import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';
import { RecordStatus } from '@src/types/schemas';

export enum ConversationTypes {
  PRIVATE = 'PRIVATE',
  GROUP = 'GROUP',
}

export type DeleteTimestamp = {
  userId: string;
  deletedAt: number;
};

@Schema()
export class Conversation {
  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }], required: true })
  users: string[];

  @Prop({ default: ConversationTypes.PRIVATE, required: true })
  type: ConversationTypes;

  @Prop({ required: true })
  createdAt: number;

  @Prop()
  name: string;

  @Prop({ default: RecordStatus.ACTIVE, required: true })
  status: RecordStatus;

  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }] })
  blockedBy: string[];

  @Prop()
  deleteTimestamps: DeleteTimestamp[];
}

export type TConversationDocument = Conversation & Document;

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

ConversationSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.id = ret._id;

    delete ret._id;
    delete ret.__v;
    delete ret.blockedBy;
    delete ret.deleteTimestamps;
  },
});
