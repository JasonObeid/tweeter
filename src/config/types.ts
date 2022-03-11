export interface TwitterAuthSession {
  session_id: string;
  session_state: string;
  code_verifier: string;
}

export interface GenerateAuthLinkResponse {
  url: string;
  session_id: string;
}

export interface TwitterAuth {
  id: string;
  username: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  created_at: string;
  session_id: string;
}

export type EngagementType = "reply" | "retweet" | "like";

export interface MessageQueue {
  id: string;
  created_at: string;
  updated_at: string;
  completed_at: string;
  queued_for: string;
  sender_auth_id: string;
  target_tweet_id: string;
  action_type: EngagementType;
  reply_text?: string;
  retry_counter: number;
  is_success?: boolean;
}

export interface MessageQueueConstructor {
  queued_for?: string;
  sender_auth_id: string;
  target_tweet_id: string;
  action_type: EngagementType;
  reply_text?: string;
}
