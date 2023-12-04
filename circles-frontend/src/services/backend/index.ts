import { Fetcher } from "@services/fetcher";

export const BackendFetcher = new Fetcher({
  baseUrl: process.env.BACKEND_URL,
});
