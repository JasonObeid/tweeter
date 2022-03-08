import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useDebounce } from "use-debounce";
import { get } from "../config/fetch";
import { useAuthContext } from "../context/AuthContext";

const nonNumeric = new RegExp("[^0-9]");
export function isNumeric(string: string) {
  const replacedString = string.replace(nonNumeric, "");
  if (replacedString === string) {
    return true;
  }
  return false;
}

export function useCheckTweetId() {
  const { session } = useAuthContext();

  const [tweetId, setTweetId] = useState("");
  const [isTweetIdTouched, setIsTweetIdTouched] = useState(false);
  const [debouncedTweetId] = useDebounce(tweetId, 1000);

  useEffect(() => {
    if (debouncedTweetId.length > 0) {
      setIsTweetIdTouched(true);
    }
  }, [debouncedTweetId]);

  async function checkTweetId() {
    if (debouncedTweetId.length > 0 && isNumeric(debouncedTweetId)) {
      const checkTweetIdResult = await get<{
        id: string;
        isValid: boolean;
        text: string;
      }>(`/api/twitter/tweetExists?tweetId=${debouncedTweetId}`, {
        token: session?.access_token,
      });
      return {
        tweetId: checkTweetIdResult?.id,
        text: checkTweetIdResult?.text,
        isValid: checkTweetIdResult?.isValid ?? false,
      };
    }
  }

  const checkTweetIdQuery = useQuery(
    ["checkTweetId", debouncedTweetId],
    checkTweetId,
    {
      cacheTime: 5 * 60 * 1000,
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  );

  const isTweetIdNotCheckable =
    isTweetIdTouched &&
    !(debouncedTweetId.length > 0 && isNumeric(debouncedTweetId));

  return {
    checkTweetIdQuery,
    isTweetIdNotCheckable,
    tweetId,
    setTweetId,
  };
}
