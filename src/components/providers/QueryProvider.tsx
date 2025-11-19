"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export default function QueryProvider({ children }: { children: ReactNode }) {
  // Create the client once (per browser session)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Avoid hydration mismatch + improve UX
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            refetchOnMount: false,

            
      // Prevent excessive network calls
            staleTime: 1000 * 60, // 1 minute
            gcTime: 1000 * 60 * 5, // 5 minutes

            retry: 1, // Retry just once (clean UX)
          },
          mutations: {
            retry: 0, // Don’t retry mutations by default
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
