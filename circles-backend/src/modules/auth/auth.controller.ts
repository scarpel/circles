import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthService } from './auth.service';
import { CredentailsDto } from './dtos/credentails.dto';
import { Request, Response } from 'express';
import { DuplicatedDocumentError } from '@errors/DuplicatedDocumentError';
import RefreshTokenDto from './dtos/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() userInfo: CreateUserDto) {
    try {
      return await this.authService.createUser(userInfo);
    } catch (err) {
      if (err instanceof DuplicatedDocumentError)
        throw new BadRequestException('Email already in use!');

      throw err;
    }
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() credentails: CredentailsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.signIn(credentails);

    if (!user) throw new UnauthorizedException('Invalid credentails!');

    const { accessToken, refreshToken, accessTokenExpiration } =
      await this.authService.generateAuthToken(user);

    this.authService.storeRefreshTokenCookie(res, refreshToken);

    return {
      user,
      accessToken,
      refreshToken,
      accessTokenExpiration,
    };
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  async signOut(@Res({ passthrough: true }) res: Response) {
    this.authService.deleteRefreshTokenCookie(res);
  }

  @Post('refresh')
  async refreshAuth(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: RefreshTokenDto,
  ) {
    const { circles } = req.signedCookies || {};

    const refreshToken = body.refreshToken || circles;

    const tokens = await this.authService.doRefreshToken(refreshToken);

    if (!tokens) throw new UnauthorizedException('Invalid refresh token!');

    return tokens;
  }
}
