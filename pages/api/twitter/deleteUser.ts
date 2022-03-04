import type { NextApiRequest, NextApiResponse } from "next";
import { deleteUser } from "../services/_deleteUserService";
import { supabaseClient, twitterClient } from "../services/_getClients";

export default async function DeleteUserEndpoint(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;
  try {
    const deletedUser = await deleteUser(
      supabaseClient,
      twitterClient,
      id as string,
    );
    res.status(200).json(deletedUser);
  } catch (error: unknown) {
    console.error(error);
    res.status(400).json(error);
  }
}
