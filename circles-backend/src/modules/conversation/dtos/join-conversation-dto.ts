import { IsString } from 'class-validator';

export class JoinConversationDto {
  @IsString()
  chatId: string;
}
