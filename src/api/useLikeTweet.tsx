import { useMutation } from "react-query";
import { get } from "../fetch";
import { TwitterAuthUser } from "./useTwitterAccounts";

export interface LikeProps {
  tweetId: string;
  selectedUsers: TwitterAuthUser[];
}
export async function like({ tweetId, selectedUsers }: LikeProps) {
  if (tweetId.length > 0 && selectedUsers.length > 0) {
    const usersParam = selectedUsers
      .map((user) => `usernames=${user.username}`)
      .join("&");
    const likeResult = await get<boolean[]>(
      `/api/twitter/like?tweetId=${tweetId}&${usersParam}`,
    );
    return likeResult;
  }
  return null;
}

export function useLikeTweet() {
  const likeMutation = useMutation(like, {
    mutationKey: "like",
    onSuccess: (a) => {
      console.log(a);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return { likeMutation };
}
