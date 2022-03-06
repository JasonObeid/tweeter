import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Layout } from "../src/components/Layout";
import { LoadingSpinner } from "../src/components/LoadingSpinner";

import EnforceAuthenticated from "../src/components/EnforceAuthenticated";
import { useTwitterLogin } from "../src/hooks/useTwitterLogin";
import { Success } from "../src/components/Success";
import { Error } from "../src/components/Error";

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
          <Success text="Logged in successfully" />
        ) : (
          <Error text="Failed to log in" />
        )}
      </div>
    </Layout>
  );
}
