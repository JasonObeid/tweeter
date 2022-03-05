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
