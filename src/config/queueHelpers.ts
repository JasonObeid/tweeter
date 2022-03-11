import { PostgrestResponse } from "@supabase/supabase-js";
import { TwitterAuthUser } from "../hooks/useTwitterAccounts";
import { client } from "./supabaseClient";
import { EngagementType, MessageQueue, MessageQueueConstructor } from "./types";

export function createMessageQueueData(
  selectedUsers: TwitterAuthUser[],
  tweetId: string,
  actionType: EngagementType,
) {
  const sendAfter = new Date();
  const randomDelay = Math.floor(Math.random() * 5);
  sendAfter.setMinutes(sendAfter.getMinutes() + randomDelay);
  const messageQueueData: MessageQueueConstructor[] = selectedUsers.map(
    (user) => {
      const randomDelay = Math.floor(Math.random() * 5) + 1;
      sendAfter.setMinutes(sendAfter.getMinutes() + randomDelay);

      return {
        queued_for: sendAfter.toISOString(),
        action_type: actionType,
        sender_auth_id: user.id,
        target_tweet_id: tweetId,
        reply_text: actionType === "reply" ? user.reply_text : undefined,
      };
    },
  );

  return messageQueueData;
}

export async function storeMessageQueueData(
  messageQueueData: MessageQueueConstructor[],
) {
  const { data, error, status }: PostgrestResponse<MessageQueue> = await client
    .from("message_queue")
    .upsert(messageQueueData);

  if (error && status !== 406) {
    throw error;
  }

  if (data === null) {
    throw new Error("updated message_queue was null");
  }

  return data;
}
