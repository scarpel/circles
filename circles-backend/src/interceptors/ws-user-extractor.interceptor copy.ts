import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getUserInfoFromWsRequest } from '@utils/token';
import { Observable } from 'rxjs';

@Injectable()
export class WsUserExtractorInterceptor implements NestInterceptor {
  constructor(private jwtService: JwtService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToWs().getClient();

    req.user = getUserInfoFromWsRequest(req, this.jwtService);

    return next.handle();
  }
}
