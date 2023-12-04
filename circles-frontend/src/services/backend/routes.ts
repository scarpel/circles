export const CONVERSATION_ROUTE = "conversations";
export const AUTH_ROUTE = "auth";

export function mergePaths(...args: string[]) {
  return args.join("/");
}

export default {
  Main: {
    logIn: "login",
    signUp: "signup",
    chat: "chat",
  },
  Conversations: {
    base: CONVERSATION_ROUTE,
    createPrivateConversation: mergePaths(CONVERSATION_ROUTE, "private"),
    getConversationById: CONVERSATION_ROUTE,
  },
  Auth: {
    base: AUTH_ROUTE,
    signUp: mergePaths(AUTH_ROUTE, "signup"),
  },
};
