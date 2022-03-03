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
    const usersParam = selectedUsers
      .map((user) => `usernames=${user.username}`)
      .join("&");
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
    onSuccess: (a) => {
      console.log(a);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return { replyTweetMutation };
}
