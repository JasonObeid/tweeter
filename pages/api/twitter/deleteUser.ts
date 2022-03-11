import type { NextApiRequest, NextApiResponse } from "next";
import { checkAuthentication } from "../services/_checkAuthenticationService";
import { deleteUser } from "../services/_deleteUserService";
import { supabaseClient, twitterClient } from "../services/_getClients";
import { logger } from "../_logger";

export default async function DeleteUserEndpoint(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await checkAuthentication(req, res);

  const { id } = req.query;

  try {
    const deletedUser = await deleteUser(
      supabaseClient,
      twitterClient,
      id as string,
    );
    res.status(200).json(deletedUser);
  } catch (error: unknown) {
    logger.error(error);
    res.status(400).json((error as Error).toString());
  }
}
