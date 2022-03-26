import {
  PostgrestResponse,
  PostgrestSingleResponse,
  SupabaseClient,
} from "@supabase/supabase-js";
import { TwitterApi } from "twitter-api-v2";
import { getUserTwitterClientsMap } from "./_getUserTwitterClientService";
import { logger } from "../_logger";
import { FollowQueue } from "./_requestFollowService";

export async function updateFollowQueueItem(
  supabaseClient: SupabaseClient,
  updatedMessage: FollowQueue,
  isSuccess: boolean,
) {
  const now = new Date().toISOString();
  const { data, error }: PostgrestSingleResponse<FollowQueue> =
    await supabaseClient
      .from("follow_queue")
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
    throw new Error("Returned follow queue data was null");
  }
  return data;
}

export async function getFollowsFromQueue(supabaseClient: SupabaseClient) {
  const now = new Date().toISOString();
  const { data, error }: PostgrestResponse<FollowQueue> = await supabaseClient
    .from("follow_queue")
    .select(
      "id,created_at,updated_at,completed_at,queued_for,sender_auth_id,target_user_id,retry_counter,is_success",
    )
    .lte("queued_for", now)
    .not("is_success", "is", true)
    .lte("retry_counter", 3);

  if (error) {
    throw new Error(error.message);
  } else if (data === null) {
    throw new Error("Returned follow queue data was null");
  }
  return data;
}

export function getFollowsByUserId(followRequests: FollowQueue[]) {
  const userIdFollows = new Map<string, FollowQueue[]>();

  followRequests.forEach((followRequest) => {
    const key = followRequest.sender_auth_id;
    if (userIdFollows.has(key)) {
      userIdFollows.set(key, [
        ...(userIdFollows.get(key) as FollowQueue[]),
        followRequest,
      ]);
    } else {
      userIdFollows.set(key, [followRequest]);
    }
  });

  return userIdFollows;
}

export async function followUsers(
  followRequests: FollowQueue[],
  clients: Map<string, TwitterApi>,
  supabaseClient: SupabaseClient,
) {
  const results: Record<string, string> = {};

  await Promise.all(
    followRequests.map(async (followRequest) => {
      if (clients.has(followRequest.sender_auth_id)) {
        const userTwitterClient = clients.get(
          followRequest.sender_auth_id,
        ) as TwitterApi;

        try {
          const { data: userObject, errors: userObjectErrors } =
            await userTwitterClient.v2.me();
          if (userObjectErrors) {
            throw new Error(JSON.stringify(userObjectErrors));
          }

          const { data, errors } = await userTwitterClient.v2.follow(
            userObject.id,
            followRequest.target_user_id,
          );
          if (errors) {
            throw new Error(JSON.stringify(userObjectErrors));
          }

          const isSuccess = data.following || data.pending_follow;
          const updatedLikeMessage = await updateFollowQueueItem(
            supabaseClient,
            followRequest,
            isSuccess,
          );
          results[updatedLikeMessage.id] = (
            updatedLikeMessage.is_success ?? false
          ).toString();
        } catch (error) {
          logger.error(error);
          results[followRequest.id] = JSON.stringify(error);
          await updateFollowQueueItem(supabaseClient, followRequest, false);
        }
      } else {
        logger.error("unexpectedly missing a twitter client");
      }
    }),
  );

  return results;
}

export async function runFollowQueue(supabaseClient: SupabaseClient) {
  const followRequests = await getFollowsFromQueue(supabaseClient);
  logger.info(followRequests);

  const userIdFollows = getFollowsByUserId(followRequests);
  logger.info(userIdFollows);

  const clients = await getUserTwitterClientsMap(
    supabaseClient,
    Array.from(userIdFollows.keys()),
  );

  const results = await followUsers(followRequests, clients, supabaseClient);
  logger.info(results);
  return results;
}
