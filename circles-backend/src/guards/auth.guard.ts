import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getAccessTokenFromAuthorization } from '@utils/token';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToHttp().getRequest() as Request;

      const token = getAccessTokenFromAuthorization(req.headers.authorization);

      return token ? !!this.jwtService.verify(token) : false;
    } catch (err) {
      Logger.error(err);
      return false;
    }
  }
}
