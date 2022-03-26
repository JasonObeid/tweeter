import { TwitterApi } from "twitter-api-v2";
import { logger } from "../_logger";
import { PostgrestResponse, SupabaseClient } from "@supabase/supabase-js";
import { randomInt } from "crypto";
import { getUserTwitterClients } from "./_getUserTwitterClientService";

export interface FollowQueue {
  id: string;
  created_at: string;
  updated_at: string;
  completed_at: string;
  queued_for: string;
  sender_auth_id: string;
  target_user_id: string;
  retry_counter: number;
  is_success?: boolean;
}

export interface FollowQueueConstructor {
  queued_for?: string;
  sender_auth_id: string;
  target_user_id: string;
}

function shuffle<T>(a: T[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function getUserFollowing(
  twitterClient: TwitterApi,
  followUsername: string,
) {
  const max = randomInt(150, 200);

  const { data: userData, errors: userDataErrors } =
    await twitterClient.v2.userByUsername(followUsername);
  if (userDataErrors) {
    logger.info(JSON.stringify(userDataErrors));
    throw new Error(JSON.stringify(userDataErrors));
  }
  console.log(userData);

  const targetUserId = userData.id;

  const { data, errors } = await twitterClient.v2.following(targetUserId, {
    max_results: 300,
  });

  if (errors) {
    logger.info(JSON.stringify(errors));
    throw new Error(JSON.stringify(errors));
  }

  const shuffledFollowing = shuffle(
    data.slice(0, max >= data.length ? undefined : max),
  );
  console.log(shuffledFollowing);
  return { following: shuffledFollowing, targetUserId };
}

export async function createFollowQueueData(
  supabaseClient: SupabaseClient,
  userAuthIds: string[],
  followUsername: string,
) {
  const userTwitterClients = await getUserTwitterClients(supabaseClient, [
    userAuthIds[0],
  ]);
  const { following } = await getUserFollowing(
    userTwitterClients[0],
    followUsername,
  );

  const sendAfter = new Date();
  const randomDelay = Math.floor(Math.random() * 5);
  sendAfter.setMinutes(sendAfter.getMinutes() + randomDelay);

  const followQueueData: FollowQueueConstructor[] = userAuthIds.flatMap(
    (userId) =>
      following.map((follow) => {
        const randomDelay = Math.floor(Math.random() * 5) + 1;
        sendAfter.setMinutes(sendAfter.getMinutes() + randomDelay);

        const data: FollowQueueConstructor = {
          queued_for: sendAfter.toISOString(),
          sender_auth_id: userId,
          target_user_id: follow.id,
        };

        return data;
      }),
  );

  return followQueueData;
}

export async function storeFollowQueueData(
  supabaseClient: SupabaseClient,
  followQueueData: FollowQueueConstructor[],
) {
  const { data, error, status }: PostgrestResponse<FollowQueue> =
    await supabaseClient.from("follow_queue").upsert(followQueueData);

  if (error && status !== 406) {
    throw error;
  }

  if (data === null) {
    throw new Error("updated follow_queue was null");
  }

  return data;
}

export async function addToFollowQueue(
  supabaseClient: SupabaseClient,
  userAuthIds: string[],
  followUsername: string,
) {
  const followQueueData = await createFollowQueueData(
    supabaseClient,
    userAuthIds,
    followUsername,
  );

  const insertedQueueData = await storeFollowQueueData(
    supabaseClient,
    followQueueData,
  );

  return insertedQueueData;
}
