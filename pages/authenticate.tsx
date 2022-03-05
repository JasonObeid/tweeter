import { NextApiRequest } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Layout } from "./components/Layout";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { useTwitterLogin } from "./hooks/useTwitterLogin";

import EnforceAuthenticated from "./components/EnforceAuthenticated";

export const getServerSideProps = EnforceAuthenticated();

export default function TwitterLogin() {
  const { twitterLoginMutation } = useTwitterLogin();
  const { query } = useRouter();

  useEffect(() => {
    if (query["state"] !== undefined && query["code"] !== undefined) {
      twitterLoginMutation.mutate({
        state: query["state"] as string,
        code: query["code"] as string,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <Layout>
      <div>
        Login page:
        {twitterLoginMutation.isLoading ? (
          <div>
            Logging into twitter <LoadingSpinner />
          </div>
        ) : twitterLoginMutation.isSuccess ? (
          "Success"
        ) : (
          "failure"
        )}
      </div>
    </Layout>
  );
}
