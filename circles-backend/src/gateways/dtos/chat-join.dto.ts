import { IsString } from 'class-validator';

export default class ChatJoinDto {
  @IsString()
  chatId: string;
}
