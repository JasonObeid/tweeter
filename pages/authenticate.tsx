import { useRouter } from "next/router";
import { useEffect } from "react";
import { Layout } from "./components/Layout";
import { useTwitterLogin } from "./hooks/useTwitterLogin";

export default function TwitterLogin() {
  const { twitterLoginMutation } = useTwitterLogin();
  const { query } = useRouter();

  console.log(query);
  console.log(query["state"]);
  console.log(query["code"]);
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
        Login page:{" "}
        {twitterLoginMutation.isLoading
          ? "loading"
          : twitterLoginMutation.isSuccess
          ? "Success"
          : "failure"}
      </div>
    </Layout>
  );
}
