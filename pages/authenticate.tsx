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
      <section className="body-font bg-gray-900 text-gray-400">
        <div className="container mx-auto flex flex-wrap items-center px-5 py-24">
          <div className="m-auto mt-10 flex w-full flex-col rounded-lg bg-gray-800 bg-opacity-50 p-8 md:mt-0 md:w-1/2 lg:w-2/6">
            <h2 className="text-md title-font mb-5 text-center font-medium text-white md:text-lg">
              Twitter Authentication Page
            </h2>
            {twitterLoginMutation.isLoading ? (
              <div className="flex content-center justify-center gap-4">
                <p>Logging into twitter</p>
                <LoadingSpinner />
              </div>
            ) : twitterLoginMutation.isSuccess ? (
              <Success text="Logged in successfully" />
            ) : (
              <Error text="Failed to log in" />
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
