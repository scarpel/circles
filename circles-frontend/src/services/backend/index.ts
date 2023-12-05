import { Fetcher } from "@services/fetcher";

export const BackendFetcher = new Fetcher({
  baseUrl: process.env.CLIENT_BACKEND_URL,
});
