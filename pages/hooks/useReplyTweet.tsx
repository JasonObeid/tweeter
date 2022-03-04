import { useMutation } from "react-query";
import { post } from "../config/fetch";
import { TwitterAuthUser } from "./useTwitterAccounts";

export interface ReplyTweetProps {
  tweetId: string;
  selectedUsers: TwitterAuthUser[];
}
export async function replyTweet({ tweetId, selectedUsers }: ReplyTweetProps) {
  if (tweetId.length > 0 && selectedUsers.length > 0) {
    const retweetResult = await post<boolean[]>(
      `/api/twitter/reply?tweetId=${tweetId}`,
      {
        body: JSON.stringify(selectedUsers),
      },
    );
    return retweetResult;
  }
  return null;
}

export function useReplyTweetMutation() {
  const replyTweetMutation = useMutation(replyTweet, {
    mutationKey: "replyTweet",
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return { replyTweetMutation };
}
