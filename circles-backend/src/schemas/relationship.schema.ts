import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from './user.schema';

export enum RelationshipStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
}

@Schema()
export class Relationship {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  fromUser: User;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  toUser: User;

  @Prop({ required: true, default: RelationshipStatus.ACTIVE })
  status: RelationshipStatus;
}

export type TRelationshipDocument = Relationship & Document;

export const RelationshipSchema = SchemaFactory.createForClass(Relationship);
