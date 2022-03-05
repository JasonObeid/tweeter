import { useMutation } from "react-query";
import { post } from "../config/fetch";
import { useAuthContext } from "../context/AuthContext";
import { TwitterAuthUser } from "./useTwitterAccounts";

export interface ReplyTweetProps {
  tweetId: string;
  selectedUsers: TwitterAuthUser[];
}

export function useReplyTweetMutation() {
  const { session } = useAuthContext();

  async function replyTweet({ tweetId, selectedUsers }: ReplyTweetProps) {
    if (tweetId.length > 0 && selectedUsers.length > 0) {
      const retweetResult = await post<boolean[]>(
        `/api/twitter/reply?tweetId=${tweetId}`,
        {
          token: session?.access_token,
          body: JSON.stringify(selectedUsers),
        },
      );
      return retweetResult;
    }
    return null;
  }

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
