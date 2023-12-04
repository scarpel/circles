import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getUserInfoFromRequest } from '@utils/token';
import { Observable } from 'rxjs';

@Injectable()
export class UserExtractorInterceptor implements NestInterceptor {
  constructor(private jwtService: JwtService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    req.user = getUserInfoFromRequest(req, this.jwtService);

    return next.handle();
  }
}
