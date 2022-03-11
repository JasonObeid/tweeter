import {
  PostgrestResponse,
  PostgrestSingleResponse,
  SupabaseClient,
} from "@supabase/supabase-js";
import { TwitterApi } from "twitter-api-v2";
import { MessageQueue } from "../../../src/config/types";
import { like } from "./_likeService";
import { getUserTwitterClientsMap } from "./_getUserTwitterClientService";
import { retweet } from "./_retweetService";
import { replyTweet } from "./_replyTweetService";
import { logger } from "../_logger";

export async function updateMessageQueueItem(
  supabaseClient: SupabaseClient,
  updatedMessage: MessageQueue,
  isSuccess: boolean,
) {
  const now = new Date();
  const { data, error }: PostgrestSingleResponse<MessageQueue> =
    await supabaseClient
      .from("message_queue")
      .update({
        updated_at: now,
        completed_at: now,
        retry_counter: updatedMessage.retry_counter + 1,
        is_success: isSuccess,
      })
      .eq("id", updatedMessage.id)
      .single();

  if (error) {
    throw new Error(error.message);
  } else if (data === null) {
    throw new Error("Returned message queue data was null");
  }
  return data;
}

export async function getMessagesFromQueue(supabaseClient: SupabaseClient) {
  const now = new Date();
  const { data, error }: PostgrestResponse<MessageQueue> = await supabaseClient
    .from("message_queue")
    .select(
      "id,created_at,updated_at,completed_at,queued_for,sender_auth_id,target_tweet_id,action_type,reply_text,retry_counter,is_success",
    )
    .lte("queued_for", now)
    .neq("is_success", true)
    .lte("retry_counter", 3);

  if (error) {
    throw new Error(error.message);
  } else if (data === null) {
    throw new Error("Returned message queue data was null");
  }
  return data;
}

export async function engagementQueueService(supabaseClient: SupabaseClient) {
  const messages = await getMessagesFromQueue(supabaseClient);
  const userIdMessages = new Map<string, MessageQueue[]>();
  messages.forEach((message) => {
    const key = message.sender_auth_id;
    if (userIdMessages.has(key)) {
      userIdMessages.set(key, [
        ...(userIdMessages.get(key) as MessageQueue[]),
        message,
      ]);
    } else {
      userIdMessages.set(key, [message]);
    }
  });
  const clients = await getUserTwitterClientsMap(
    supabaseClient,
    Array.from(userIdMessages.keys()),
  );

  const results: Record<string, string> = {};

  messages.forEach(async (message) => {
    if (clients.has(message.sender_auth_id)) {
      const userTwitterClient = clients.get(
        message.sender_auth_id,
      ) as TwitterApi;

      switch (message.action_type) {
        case "like":
          try {
            const isLikeSuccess = await like(
              userTwitterClient,
              message.target_tweet_id,
            );
            const updatedLikeMessage = await updateMessageQueueItem(
              supabaseClient,
              message,
              isLikeSuccess,
            );
            results[updatedLikeMessage.id] = (
              updatedLikeMessage.is_success ?? false
            ).toString();
          } catch (error) {
            results[message.id] = JSON.stringify(error);
          }

        case "retweet":
          try {
            const isRetweetSuccess = await retweet(
              userTwitterClient,
              message.target_tweet_id,
            );
            const updatedRetweetMessage = await updateMessageQueueItem(
              supabaseClient,
              message,
              isRetweetSuccess,
            );
            results[updatedRetweetMessage.id] = (
              updatedRetweetMessage.is_success ?? false
            ).toString();
          } catch (error) {
            results[message.id] = JSON.stringify(error);
          }

        case "reply":
          if (message.reply_text) {
            try {
              const isReplySuccess = await replyTweet(
                userTwitterClient,
                message.target_tweet_id,
                message.reply_text as string,
              );
              const updatedReplyMessage = await updateMessageQueueItem(
                supabaseClient,
                message,
                isReplySuccess,
              );
              results[updatedReplyMessage.id] = (
                updatedReplyMessage.is_success ?? false
              ).toString();
            } catch (error) {
              results[message.id] = JSON.stringify(error);
            }
          }
          logger.error("unexpectedly missing reply text");

        default:
          logger.error("received an invalid action_type");
      }

      logger.error("unexpectedly missing a twitter client");
    }
  });

  return results;
}
