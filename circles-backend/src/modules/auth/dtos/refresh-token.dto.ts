import { IsOptional, IsString } from 'class-validator';

export default class RefreshTokenDto {
  @IsString()
  @IsOptional()
  refreshToken: string;
}
