import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Socket } from 'socket.io';

export function getAccessTokenFromAuthorization(authentication: string = '') {
  const [type, token] = authentication.split(' ');

  return type === 'Bearer' ? token : null;
}

export function getUserInfoFromAuthorization(
  authorization: string,
  jwtService: JwtService,
) {
  try {
    const token = getAccessTokenFromAuthorization(authorization);

    if (!token) return null;

    const { id, email, username } = jwtService.verify(token);

    return { id, email, username };
  } catch (err) {
    Logger.error(err);

    return null;
  }
}

export function getUserInfoFromRequest(req: Request, jwtService: JwtService) {
  return getUserInfoFromAuthorization(req.headers.authorization, jwtService);
}

export function getUserInfoFromWsRequest(req: Socket, jwtService: JwtService) {
  return getUserInfoFromAuthorization(
    req.handshake.headers.authorization,
    jwtService,
  );
}
