import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class CredentailsDto extends PickType(CreateUserDto, [
  'email',
  'password',
]) {}
