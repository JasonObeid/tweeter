import { useMutation } from "react-query";
import { get } from "../config/fetch";
import { useAuthContext } from "../context/AuthContext";
import { TwitterAuthUser } from "./useTwitterAccounts";

export interface LikeProps {
  tweetId: string;
  selectedUsers: TwitterAuthUser[];
}

export function useLikeTweet() {
  const { session } = useAuthContext();

  async function like({ tweetId, selectedUsers }: LikeProps) {
    if (tweetId.length > 0 && selectedUsers.length > 0) {
      const usersParam = selectedUsers
        .map((user) => `ids=${user.id}`)
        .join("&");
      const likeResult = await get<boolean[]>(
        `/api/twitter/like?tweetId=${tweetId}&${usersParam}`,
        { token: session?.access_token },
      );
      return likeResult;
    }
    return null;
  }

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
