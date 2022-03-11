import { useMutation } from "react-query";
import {
  createMessageQueueData,
  storeMessageQueueData,
} from "../config/queueHelpers";
import { MessageQueueConstructor } from "../config/types";
import { TwitterAuthUser } from "./useTwitterAccounts";

export interface ReplyTweetProps {
  tweetId: string;
  selectedUsers: TwitterAuthUser[];
}

export function useReplyTweetMutation() {
  async function replyTweet({ tweetId, selectedUsers }: ReplyTweetProps) {
    if (tweetId.length > 0 && selectedUsers.length > 0) {
      const queueData: MessageQueueConstructor[] = createMessageQueueData(
        selectedUsers,
        tweetId,
        "reply",
      );
      const insertedQueueData = storeMessageQueueData(queueData);

      return insertedQueueData;
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
