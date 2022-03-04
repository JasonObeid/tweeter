import { useMutation } from "react-query";
import { get } from "../config/fetch";
import { TwitterAuthUser } from "./useTwitterAccounts";

export interface RetweetProps {
  tweetId: string;
  selectedUsers: TwitterAuthUser[];
}
export async function retweet({ tweetId, selectedUsers }: RetweetProps) {
  if (tweetId.length > 0 && selectedUsers.length > 0) {
    const usersParam = selectedUsers.map((user) => `ids=${user.id}`).join("&");
    const retweetResult = await get<boolean[]>(
      `/api/twitter/retweet?tweetId=${tweetId}&${usersParam}`,
    );
    return retweetResult;
  }
  return null;
}

export function useRetweet() {
  const retweetMutation = useMutation(retweet, {
    mutationKey: "retweet",
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return { retweetMutation };
}