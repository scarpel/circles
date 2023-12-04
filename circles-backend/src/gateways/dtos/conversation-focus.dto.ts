import { IsString } from 'class-validator';

export class ConversationFocusDto {
  @IsString()
  id: string;
}
