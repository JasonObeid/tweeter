import { NextApiRequest, NextApiResponse } from "next";
import { supabaseClient } from "./_getClients";

export async function checkAuthentication(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.headers.token === undefined) {
    res.status(403).json("Authorization header must be present");
  } else {
    const { user, error } = await supabaseClient.auth.api.getUser(
      req.headers.token as string,
    );

    if (!user) {
      res
        .status(403)
        .json(error?.message ?? "Must be authenticated to use this endpoint");
    }
  }
}
