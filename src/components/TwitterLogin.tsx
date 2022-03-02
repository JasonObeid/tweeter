import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useTwitterLogin } from "../api/useTwitterLogin";

export function TwitterLogin() {
  const { twitterLoginMutation } = useTwitterLogin();
  const [searchParams] = useSearchParams();
  useEffect(() => {
    if (
      !twitterLoginMutation.isSuccess &&
      searchParams.has("state") &&
      searchParams.has("code")
    ) {
      twitterLoginMutation.mutate(searchParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      Login page:{" "}
      {twitterLoginMutation.isLoading
        ? "loading"
        : twitterLoginMutation.isSuccess
        ? "Success"
        : "failure"}
    </div>
  );
}
