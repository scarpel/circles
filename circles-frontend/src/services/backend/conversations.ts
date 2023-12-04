import { BackendFetcher } from ".";
import routes, { mergePaths } from "./routes";
import {
  TConversationPayload,
  TInitialConversationPayload,
} from "@customTypes/conversations";

export async function createPrivateConversation(withUserId: string) {
  if (!withUserId)
    throw new Error("Cannot create private conversation with empty user id!");

  return BackendFetcher.post<TConversationPayload>(
    routes.Conversations.createPrivateConversation,
    {
      withUserId,
    }
  );
}

export async function getConversationById(conversationId: string) {
  return BackendFetcher.get<TConversationPayload | null>(
    mergePaths(routes.Conversations.base, conversationId)
  );
}

export async function getInitialConversations() {
  return BackendFetcher.get<TInitialConversationPayload[]>(
    routes.Conversations.base
  );
}
