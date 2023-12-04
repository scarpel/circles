import { IsString, MaxLength, MinLength } from 'class-validator';

export class ChatMessageDto {
  @IsString()
  to: string;

  @IsString()
  @MinLength(1)
  @MaxLength(5000)
  content: string;
}
