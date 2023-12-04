import { AuthGuard } from '@guards/auth.guard';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MissingDocumentError } from '@errors/MissingDocumentError';
import { User } from '@decorators/user.decorator';
import { TUserFromToken } from '@modules/auth/types/auth.types';
import { UserExtractorInterceptor } from '@interceptors/user-extractor.interceptor';
import { ConversationService } from './conversation.service';
import { ConversationAlreadyExistsError } from '@errors/ConversationAlreadyExistsError';
import CreatePrivateConversationDto from './dtos/create-private-conversation-dto';
import { ConversationTypes } from '@schemas/conversation.schema';

@Controller('conversations')
@UseGuards(AuthGuard)
@UseInterceptors(UserExtractorInterceptor)
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get()
  async getConversationsFromUser(@User() user: TUserFromToken) {
    return this.conversationService.getConversationsFromUser(user);
  }

  @Post('private')
  async createPrivateConversation(
    @User() user: TUserFromToken,
    @Body() conversationInfo: CreatePrivateConversationDto,
  ) {
    try {
      if (user.id === conversationInfo.withUserId)
        throw new BadRequestException('Invalid user!');

      return await this.conversationService.createConversation(user, {
        type: ConversationTypes.PRIVATE,
        users: [conversationInfo.withUserId],
      });
    } catch (err) {
      if (
        err instanceof MissingDocumentError ||
        err instanceof ConversationAlreadyExistsError
      ) {
        throw new BadRequestException(err.message);
      }

      throw err;
    }
  }

  @Get(':id')
  async getConversation(@User() user: TUserFromToken, @Param('id') id: string) {
    const conversation = await this.conversationService.getConversationById(id);

    if (!conversation) return new NotFoundException('Invalid conversation id!');

    if (!conversation.users.includes(user.id))
      return new UnauthorizedException('You are not in this conversation!');

    return this.conversationService.formatConversation(user, conversation);
  }

  @Get(':id/read')
  async readMessagesFromConversation(
    @User() user: TUserFromToken,
    @Param('id') id: string,
  ) {
    const conversation = await this.conversationService.getConversationById(id);

    if (!conversation) return new NotFoundException('Invalid conversation id!');

    if (!conversation.users.includes(user.id))
      return new UnauthorizedException('You are not in this conversation!');

    return this.conversationService.formatConversation(user, conversation);
  }
}
