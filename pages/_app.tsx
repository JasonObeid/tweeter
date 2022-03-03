import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import "../styles/globals.css";
import { Auth } from "@supabase/ui";
import { client } from "./config/supabaseClient";
import LogRocket from "logrocket";

if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
  LogRocket.init("ecxlpy/tweeter");
}

const queryClient = new QueryClient();
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Auth.UserContextProvider supabaseClient={client}>
        <Component {...pageProps} />
      </Auth.UserContextProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
