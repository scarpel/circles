import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@guards/auth.guard';
import { User } from '@decorators/user.decorator';
import { TUserFromToken } from '@modules/auth/types/auth.types';
import { UserExtractorInterceptor } from '@interceptors/user-extractor.interceptor';

@Controller('users')
@UseGuards(AuthGuard)
@UseInterceptors(UserExtractorInterceptor)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  searchUsers(
    @User() user: TUserFromToken,
    @Query('search') search: string = '',
    @Query('numResults') numResults: number = 5,
  ) {
    if (search.length < 2) return [];

    if (numResults > 10)
      throw new BadRequestException(
        'Number of results must be below or equal to 10',
      );

    return this.userService
      .searchUser(search, numResults)
      .then((values) => values.filter(({ id }) => id !== user.id));
  }
}
