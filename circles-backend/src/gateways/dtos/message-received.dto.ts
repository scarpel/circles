import { IsString } from 'class-validator';

export class MessageReceivedDto {
  @IsString()
  id: string;
}
