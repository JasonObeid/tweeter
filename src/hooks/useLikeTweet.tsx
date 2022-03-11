import { useMutation } from "react-query";
import {
  createMessageQueueData,
  storeMessageQueueData,
} from "../config/queueHelpers";
import { MessageQueueConstructor } from "../config/types";
import { TwitterAuthUser } from "./useTwitterAccounts";

export interface LikeProps {
  tweetId: string;
  selectedUsers: TwitterAuthUser[];
}

export function useLikeTweet() {
  async function like({ tweetId, selectedUsers }: LikeProps) {
    if (tweetId.length > 0 && selectedUsers.length > 0) {
      const queueData: MessageQueueConstructor[] = createMessageQueueData(
        selectedUsers,
        tweetId,
        "like",
      );
      const insertedQueueData = storeMessageQueueData(queueData);

      return insertedQueueData;
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
