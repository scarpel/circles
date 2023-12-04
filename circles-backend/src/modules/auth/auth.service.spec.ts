import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@schemas/user.schema';
import { Token, TokenSchema } from '@schemas/token.schema';
import { closeMongoInstance, mockMongoRootSetup } from '@test/mongoBootstrap';
import { JwtModule } from '@nestjs/jwt';
import { mockUser } from '@test/constants';
import { getErrorName } from '@test/utils';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        mockMongoRootSetup(),
        MongooseModule.forFeature([
          {
            name: User.name,
            schema: UserSchema,
          },
          {
            name: Token.name,
            schema: TokenSchema,
          },
        ]),
        JwtModule.register({
          secret: 'testKet',
        }),
      ],
      providers: [AuthService],
    }).compile();

    service = module.get(AuthService);
  });

  afterEach(async () => {
    await closeMongoInstance();
  });

  describe('createUser()', () => {
    it('should create an user with valid params', async () => {
      const user = await service.createUser(mockUser);
      expect(user).toBeTruthy();
    });

    it('should throw an error when creating user with invalid params', async () => {
      const errorName = await getErrorName(() =>
        service.createUser({
          email: 'no-email',
        } as any),
      );

      expect(errorName).toBe('ValidationError');
    });

    it('should throw an error when creating user with existing email', async () => {
      await service.createUser(mockUser);
      const errorName = await getErrorName(() => service.createUser(mockUser));

      expect(errorName).toBe('DuplicatedDocumentError');
    });
  });

  describe('signIn()', () => {
    beforeEach(async () => {
      await service.createUser(mockUser);
    });

    it('should sign in with valid credentails', async () => {
      const user = await service.signIn({
        email: mockUser.email,
        password: mockUser.password,
      });

      expect(user).toBeTruthy();
    });

    it('should throw error when signing in with invalid credentails', async () => {
      const user = await service.signIn({
        email: mockUser.email,
        password: 'invalidPassword',
      });

      expect(user).toBeFalsy();
    });
  });

  describe('generateAuthToken()', () => {
    beforeEach(async () => {
      await service.createUser(mockUser);
    });

    it('should generate the auth tokens', async () => {
      const user = await service.signIn({
        email: mockUser.email,
        password: mockUser.password,
      });

      const tokens = await service.generateAuthToken(user);

      expect(Object.keys(tokens).sort()).toEqual(
        ['accessToken', 'refreshToken', 'accessTokenExpiration'].sort(),
      );
    });
  });

  describe('doRefreshToken()', () => {
    beforeEach(async () => {
      await service.createUser(mockUser);
    });

    it('should refresh the access token', async () => {
      const user = await service.signIn({
        email: mockUser.email,
        password: mockUser.password,
      });

      const tokens = await service.generateAuthToken(user);

      const refreshTokens = await service.doRefreshToken(tokens.refreshToken);

      expect(Object.keys(refreshTokens).sort()).toEqual(
        ['accessToken', 'refreshToken', 'accessTokenExpiration', 'user'].sort(),
      );
    });

    it('should throw an error when invalid refresh token', async () => {
      const refreshTokens = await service.doRefreshToken('invalid-token');

      expect(refreshTokens).toBeFalsy();
    });
  });
});
