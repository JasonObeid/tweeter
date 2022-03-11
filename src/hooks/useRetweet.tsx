import { useMutation } from "react-query";
import {
  createMessageQueueData,
  storeMessageQueueData,
} from "../config/queueHelpers";
import { MessageQueueConstructor } from "../config/types";
import { TwitterAuthUser } from "./useTwitterAccounts";

export interface RetweetProps {
  tweetId: string;
  selectedUsers: TwitterAuthUser[];
}

export function useRetweet() {
  async function retweet({ tweetId, selectedUsers }: RetweetProps) {
    if (tweetId.length > 0 && selectedUsers.length > 0) {
      const queueData: MessageQueueConstructor[] = createMessageQueueData(
        selectedUsers,
        tweetId,
        "retweet",
      );
      const insertedQueueData = storeMessageQueueData(queueData);

      return insertedQueueData;
    }

    return null;
  }
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
