import { VercelRequest, VercelResponse } from "@vercel/node";
import { login } from "../services/_loginService";
import { supabaseClient, twitterClient } from "../services/_getClients";

export default async function LoginEndpoint(
  req: VercelRequest,
  res: VercelResponse,
) {
  const { state, code, sessionId } = req.query;

  try {
    const generatedAuthLinkResponse = await login(
      supabaseClient,
      twitterClient,
      state as string,
      code as string,
      sessionId as string,
      process.env.REDIRECT_URI,
    );
    res.status(200).json(generatedAuthLinkResponse);
  } catch (error: unknown) {
    console.error(error);
    res.status(400).json(error);
  }
}
