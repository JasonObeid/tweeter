import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { get } from "../fetch";
import { GenerateAuthLinkResponse, TwitterAuth } from "../types";

export async function startLoginFlow() {
  const generatedAuthLinkResponse = await get<GenerateAuthLinkResponse>(
    "/api/twitter/generateAuthLink",
  );
  if (generatedAuthLinkResponse !== null) {
    localStorage.setItem(
      "twitterOAuthSessionId",
      JSON.stringify(generatedAuthLinkResponse.session_id),
    );
    window.location = generatedAuthLinkResponse.url as unknown as Location;
  }
}

export async function twitterLogin(searchParams: URLSearchParams) {
  const authSessionId = localStorage.getItem("twitterOAuthSessionId");
  const state = searchParams.get("state");
  const code = searchParams.get("code");

  if (authSessionId === null) {
    throw new Error("authSessionId was null");
  }
  if (state === null) {
    throw new Error("session state was null");
  }
  if (code === null) {
    throw new Error("session code was null");
  }

  const sessionId = JSON.parse(authSessionId);
  const loginResult = await get<TwitterAuth>(
    `/api/twitter/login?sessionId=${sessionId}&state=${state}&code=${code}`,
  );
  return loginResult;
}

export function useTwitterLogin() {
  const navigate = useNavigate();

  const startLoginFlowMutation = useMutation(startLoginFlow, {
    mutationKey: "startLoginFlow",
    onSuccess: (a) => {
      console.log(a);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const twitterLoginMutation = useMutation(twitterLogin, {
    mutationKey: "twitterAuthQuery",
    onSuccess: (loginResult) => {
      if (loginResult !== null) {
        navigate("/");
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return {
    startLoginFlowMutation,
    twitterLoginMutation,
  };
}
