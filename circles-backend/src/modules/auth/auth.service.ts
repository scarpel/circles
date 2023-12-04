import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TUserDocument, User } from '@schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { CredentailsDto } from './dtos/credentails.dto';
import { comparePassword } from '@utils/password';
import { JwtService } from '@nestjs/jwt';
import { TTokenInfo, TTokenOptions } from './types/auth.types';
import { Response } from 'express';
import { TTokenDocument, Token } from '@schemas/token.schema';
import { DuplicatedDocumentError } from '@errors/DuplicatedDocumentError';
import moment from 'moment';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<TUserDocument>,
    @InjectModel(Token.name) private readonly tokenModel: Model<TTokenDocument>,
    private jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const user = new this.userModel(createUserDto);
      return await user.save();
    } catch (err) {
      if (err.name === 'MongoServerError' && err.code === 11000)
        throw new DuplicatedDocumentError('Email already used!');

      throw err;
    }
  }

  async signIn({ email, password }: CredentailsDto) {
    const user = await this.userModel.findOne({ email });

    return user && (await comparePassword(password, user.password))
      ? user
      : null;
  }

  getTokenPayload({ _id: id, email, username }: TUserDocument) {
    return { id, email, username };
  }

  generateAccessToken(user: TUserDocument, options?: TTokenOptions) {
    return this.jwtService.sign(this.getTokenPayload(user), options);
  }

  async registerRefreshToken(userId: string) {
    const issuedAt = Math.trunc(new Date().getTime() / 1000);

    await this.tokenModel.updateOne(
      { _id: userId },
      {
        issuedAt,
      },
      { upsert: true },
    );

    return issuedAt;
  }

  async generateRefreshToken(user: TUserDocument, options: TTokenOptions = {}) {
    const { expiresIn = '7d' } = options;

    const issuedAt = await this.registerRefreshToken(user.id);

    return this.jwtService.sign(
      {
        ...this.getTokenPayload(user),
        issuedAt,
      },
      { expiresIn },
    );
  }

  async generateAuthToken(
    user: TUserDocument,
    expiresIn: number = 60 * 60 * 24,
    refreshExpiresIn: number = 60 * 60 * 24 * 7,
  ) {
    const accessToken = this.generateAccessToken(user, { expiresIn });
    const refreshToken = await this.generateRefreshToken(user, {
      expiresIn: refreshExpiresIn,
    });

    return {
      accessToken,
      refreshToken,
      accessTokenExpiration: moment().add(expiresIn, 'seconds').unix(),
    };
  }

  storeRefreshTokenCookie(res: Response, token: string) {
    res.cookie('circles', token);
  }

  deleteRefreshTokenCookie(res: Response) {
    res.clearCookie('circles');
  }

  async doRefreshToken(refreshToken: string) {
    try {
      if (!refreshToken) throw new Error('Invalid token!');

      const { issuedAt, ...user } = this.jwtService.verify(
        refreshToken,
      ) as TTokenInfo;

      const userDoc = await (user.id
        ? this.userModel.findById(user.id)
        : this.userModel.findOne({ email: user.email }));

      // const tokenInfo = await this.tokenModel.findById(user.id);

      // if (!tokenInfo || tokenInfo.issuedAt !== issuedAt)
      //   throw new Error('Expired token!');

      const refreshInfo = await this.generateAuthToken(userDoc);

      return {
        ...refreshInfo,
        user: userDoc,
      };
    } catch (err) {
      return null;
    }
  }
}
