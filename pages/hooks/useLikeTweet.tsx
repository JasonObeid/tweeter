import { useMutation } from "react-query";
import { get } from "../config/fetch";
import { TwitterAuthUser } from "./useTwitterAccounts";

export interface LikeProps {
  tweetId: string;
  selectedUsers: TwitterAuthUser[];
}
export async function like({ tweetId, selectedUsers }: LikeProps) {
  if (tweetId.length > 0 && selectedUsers.length > 0) {
    const usersParam = selectedUsers.map((user) => `ids=${user.id}`).join("&");
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
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return { likeMutation };
}
