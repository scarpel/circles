import { CreateUserDto } from '@modules/auth/dtos/create-user.dto';
import { RedisService } from '@modules/redis/redis.service';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TUserDocument, User } from '@schemas/user.schema';
import { Model } from 'mongoose';
import { SchemaFieldTypes } from 'redis';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<TUserDocument>,
    private readonly redisService: RedisService,
  ) {}

  async createUsersIndex() {
    const index = await this.redisService.client.ft
      .info('idx:users')
      .catch(() => null);

    if (index) return;

    await this.redisService.client.ft.create(
      'idx:users',
      {
        '$.username': {
          type: SchemaFieldTypes.TEXT,
          AS: 'username',
        },
        '$.id': {
          type: SchemaFieldTypes.TEXT,
          AS: 'id',
        },
        '$.name': {
          type: SchemaFieldTypes.TEXT,
          AS: 'name',
        },
      },
      {
        ON: 'JSON',
        PREFIX: 'users:',
      },
    );
  }

  async mongoSetup() {
    const users = [
      {
        name: 'Ana Doe',
        email: 'ana@guiscarpel.com',
        password: 'Aa1#klasdasd',
        username: 'ana',
      },
      {
        name: 'John Doe',
        email: 'john@guiscarpel.com',
        password: 'Aa1#klasdasd',
        username: 'john',
      },
    ] as CreateUserDto[];

    await Promise.all(
      users.map((user) =>
        new this.userModel(user).save().catch((err) => false),
      ),
    );

    Logger.log(`✅ Added ${users.length} mock users`);
  }

  async onModuleInit() {
    try {
      await this.redisService.doConnect();

      await this.createUsersIndex();

      await this.mongoSetup();

      const users = await this.userModel.find({});

      await Promise.all(
        users.map(({ username, id, name }) =>
          this.redisService.client.json.set(`users:${id}`, '$', {
            username,
            id,
            name,
          }),
        ),
      );

      Logger.log(`✅ Added ${users.length} users to redis index`);
    } catch (err) {
      Logger.error('Unable to init user', err);
    }
  }

  async searchUser(username: string = '', size: number = 5) {
    const treatedUsername = username.trim().split(' ')[0];

    const { documents } = await this.redisService.client.ft.search(
      'idx:users',
      `@username:${treatedUsername}*`,
      {
        LIMIT: {
          from: 0,
          size,
        },
      },
    );

    return documents.map(({ value }) => value);
  }
}
