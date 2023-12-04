import { Request } from 'express';
import { ObjectId } from 'mongoose';

export type TTokenOptions = { expiresIn?: string | number };

export type TTokenInfo = {
  id: string;
  email: string;
  username: string;
  issuedAt?: number;
};

export type TUserFromToken = TTokenInfo;

export type TRequestWithUser = Request & {
  user: TTokenInfo;
};
