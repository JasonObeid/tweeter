import { VercelRequest, VercelResponse } from "@vercel/node";
import { deleteUser } from "../services/_deleteUserService";
import { supabaseClient, twitterClient } from "../services/_getClients";

export default async function DeleteUserEndpoint(
  req: VercelRequest,
  res: VercelResponse,
) {
  const { username } = req.query;
  try {
    const deletedUser = await deleteUser(
      supabaseClient,
      twitterClient,
      username as string,
    );
    res.status(200).json(deletedUser);
  } catch (error: unknown) {
    console.error(error);
    res.status(400).json(error);
  }
}
