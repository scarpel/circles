import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  username: string;

  @IsEmail()
  email: string;

  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%&*^()-+=]).*$/)
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;
}
