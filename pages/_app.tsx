import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import "../styles/globals.css";
import LogRocket from "logrocket";
import React from "react";
import { AuthContextProvider } from "./context/AuthContext";

if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
  LogRocket.init("ecxlpy/tweeter");
}

const queryClient = new QueryClient();
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <Component {...pageProps} />
      </AuthContextProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
