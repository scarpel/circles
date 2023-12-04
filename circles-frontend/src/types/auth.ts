export type TUser = {
  id: string;
  name: string;
  email: string;
  username: string;
};

export type TSignInPayload = {
  user: TUser;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiration: number;
};
