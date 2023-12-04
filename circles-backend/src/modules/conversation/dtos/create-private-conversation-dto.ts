import { IsString } from 'class-validator';

export default class CreatePrivateConversationDto {
  @IsString()
  withUserId: string;
}
