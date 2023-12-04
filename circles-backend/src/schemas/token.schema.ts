import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Token {
  @Prop({ required: true })
  issuedAt: number;
}

export type TTokenDocument = Token & Document;

export const TokenSchema = SchemaFactory.createForClass(Token);
