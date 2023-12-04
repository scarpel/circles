"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import ChatDashboard from "@components/ChatDashboard";
import ChatTab from "@components/ChatTab";
import { store, useAppSelector } from "@redux/store";
import { signOut, useSession } from "next-auth/react";
import { BackendFetcher } from "@services/backend";
import { useDispatch } from "react-redux";
import { setAccessToken, setUser } from "@redux/slices/authSlice";
import { socketClient } from "@socket/client";
import {
  SocketEvents,
  TConversationsDeliverSync,
  TMessageReceiptPayload,
  TMessageReceivePayload,
} from "@socket/types";
import { getConversationById } from "@services/backend/conversations";
import {
  addReceiptToMessage,
  addMessagesToConversation,
  setupInitialConversation,
  syncConversationMessagesDeliver,
} from "@redux/slices/conversationsSlice";
import {
  TConversationPayload,
  TInitialConversationPayload,
} from "@customTypes/conversations";
import moment from "moment";

export default function Chat() {
  // Hooks
  const { data: session, update } = useSession();

  const dispatch = useDispatch();
  const focusedConversationSearchKey = useAppSelector(
    ({ conversations }) => conversations.focusedConversationSearchKey
  );

  // States
  const userRef = useRef({
    accessToken: "",
    id: "",
  });
  const expirationRef = useRef("");
  const [isLoading, setIsLoading] = useState(true);

  // Effects
  useEffect(() => {
    if (!(session?.user && session?.accessToken)) return;

    const { id, accessToken } = userRef.current;

    if (id !== session?.user.id) {
      dispatch(setUser(session?.user));
    }

    if (accessToken !== session?.accessToken) {
      initialize(session.accessToken, id !== session?.user.id);
      dispatch(setAccessToken(session?.accessToken));
    }

    userRef.current = {
      id: session?.user.id,
      accessToken: session?.accessToken!,
    };
  }, [session?.accessToken, session?.user]);

  useEffect(() => {
    if (
      !(
        session?.expires &&
        session?.accessToken &&
        session.accessToken !== expirationRef.current
      )
    )
      return;

    const nextUpdate = Math.max(0, parseInt(session.expires) - moment().unix());

    const timeout = setTimeout(update, nextUpdate * 1000);
    expirationRef.current = session.accessToken;

    return () => clearTimeout(timeout);
  }, [session?.expires, session?.accessToken]);

  // Functions
  const onNewMessage = useCallback(async (payload: TMessageReceivePayload) => {
    try {
      const { lookupIdToSearchKey } = store.getState().conversations;

      let conversationPayload: TConversationPayload | null = null;

      if (!(payload.conversationId in lookupIdToSearchKey)) {
        const { data } = await getConversationById(payload.conversationId);

        conversationPayload = data!;
      }

      store.dispatch(
        addMessagesToConversation({
          messages: [payload],
          conversationPayload,
          user: store.getState().auth.user!,
        })
      );

      const { auth, conversations } = store.getState();

      if (auth.user?.id !== payload.sender) {
        socketClient.emitEvent(SocketEvents.MessageReceived, {
          id: payload.id,
        });

        if (
          conversations.focusedConversationSearchKey ===
          conversations.lookupIdToSearchKey[payload.conversationId]
        ) {
          socketClient.emitEvent(SocketEvents.MessageRead, {
            id: payload.id,
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const onMessageReceipt = useCallback(
    async (payload: TMessageReceiptPayload) => {
      try {
        store.dispatch(
          addReceiptToMessage({
            ...payload,
            user: store.getState().auth.user!,
          })
        );
      } catch (err) {
        console.error(err);
      }
    },
    []
  );

  const onDeliverSync = useCallback(
    async (payload: TConversationsDeliverSync) => {
      try {
        store.dispatch(
          syncConversationMessagesDeliver({
            sync: payload,
            user: store.getState().auth.user!,
          })
        );
      } catch (err) {
        console.error(err);
      }
    },
    []
  );

  const configSocket = useCallback(async (accessToken?: string) => {
    try {
      if (!accessToken) return;

      socketClient.initialize(accessToken);
      await socketClient.connect();

      await socketClient.registerEvent(
        SocketEvents.MessageReceive,
        onNewMessage
      );

      await socketClient.registerEvent(
        SocketEvents.MessageReceipt,
        onMessageReceipt
      );

      await socketClient.registerEvent(
        SocketEvents.ConversationsDeliverSync,
        onDeliverSync
      );

      await socketClient.registerEvent(SocketEvents.Disconnect, () => {
        setIsLoading(true);
      });

      return (await new Promise((res) =>
        socketClient.emitEvent(SocketEvents.MessagesInitial, null, (values) => {
          return res(values);
        })
      )) as TInitialConversationPayload[];
    } catch (err) {
      console.error("Unable to connect to socket", err);
      await signOut();
    }
  }, []);

  const initialize = useCallback(
    async (accessToken: string, doConfigSocket?: boolean) => {
      if (!accessToken) return;

      try {
        setIsLoading(true);

        BackendFetcher.accessToken = accessToken;

        if (doConfigSocket) {
          await socketClient.disconnect();

          const initialConversations = await configSocket(accessToken);

          store.dispatch(
            setupInitialConversation({
              initialConversations: initialConversations!,
              user: store.getState().auth.user!,
            })
          );
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Unable to initialize", err);
      }
    },
    [configSocket]
  );

  // Render
  if (isLoading) return null;

  return (
    <main className="flex space-x-5 h-full">
      <ChatDashboard className="w-2/5 max-w-sm flex-shrink-0" />

      {focusedConversationSearchKey ? (
        <ChatTab
          key={focusedConversationSearchKey}
          conversationSearchId={focusedConversationSearchKey}
          className="w-full"
        />
      ) : null}
    </main>
  );
}
