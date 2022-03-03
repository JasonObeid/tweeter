import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useDebounce } from "use-debounce";
import { get } from "../config/fetch";

const nonNumeric = new RegExp("[^0-9]");
export function isNumeric(string: string) {
  const replacedString = string.replace(nonNumeric, "");
  if (replacedString === string) {
    return true;
  }
  return false;
}

export function useCheckTweetId() {
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
      const checkTweetIdResult = await get<boolean>(
        `/api/twitter/tweetExists?tweetId=${debouncedTweetId}`,
      );
      return {
        tweetId: debouncedTweetId,
        isValid: checkTweetIdResult || false,
      };
    }
  }

  const checkTweetIdQuery = useQuery(
    ["checkTweetId", debouncedTweetId],
    checkTweetId,
    {
      cacheTime: 5 * 60 * 1000,
      staleTime: 5 * 60 * 1000,
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
