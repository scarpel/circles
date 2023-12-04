import { MessageTypes } from '@schemas/message.schema';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class ConversationMessageDto {
  @IsString()
  conversationId: string;

  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  @IsOptional()
  content: string;

  @IsString()
  type: MessageTypes = MessageTypes.TEXT;
}
