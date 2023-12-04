"use client";

import { TLayoutProps } from "@customTypes/common";
import { store } from "@redux/store";
import { SessionProvider } from "next-auth/react";
import React, { useMemo } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";

export default function Providers({ children }: TLayoutProps) {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <SessionProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </Provider>
    </SessionProvider>
  );
}
