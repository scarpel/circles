import { TUserFromSearch } from "@customTypes/users";
import { BackendFetcher } from ".";

export async function searchForUsername(username: string) {
  if (username.length < 2) return [];

  return BackendFetcher.get<TUserFromSearch>("users", {
    query: {
      search: username,
    },
  });
}
