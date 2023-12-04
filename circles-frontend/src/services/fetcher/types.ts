import { TObject } from "@customTypes/common";

export type TFetcherInitialParams = {
  baseUrl: string;
  accessToken: string;
};

export type TQuery = TObject<string | number | boolean>;

export interface IBaseFetchParams {
  query?: TQuery;
  accessToken?: string;
  withAuthentication?: boolean;
  contentType?: string;
}

export type TResponse<TData> = Response & {
  data?: TData;
};
