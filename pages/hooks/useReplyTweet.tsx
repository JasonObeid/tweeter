import { useMutation } from "react-query";
import { get } from "../config/fetch";
import { TwitterAuthUser } from "./useTwitterAccounts";

export interface ReplyTweetProps {
  tweetId: string;
  selectedUsers: TwitterAuthUser[];
  replyText: string;
}
export async function replyTweet({
  tweetId,
  selectedUsers,
  replyText,
}: ReplyTweetProps) {
  if (tweetId.length > 0 && selectedUsers.length > 0 && replyText.length > 0) {
    const usersParam = selectedUsers.map((user) => `ids=${user.id}`).join("&");
    const retweetResult = await get<boolean[]>(
      `/api/twitter/reply?replyText=${replyText}&tweetId=${tweetId}&${usersParam}`,
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
