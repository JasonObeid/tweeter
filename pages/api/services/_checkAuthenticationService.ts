import { NextApiRequest, NextApiResponse } from "next";
import { supabaseClient } from "./_getClients";

export async function checkAuthentication(
  req: NextApiRequest,
  _res: NextApiResponse,
) {
  if (req.headers.token === undefined) {
    throw new Error("Authorization header must be present");
  } else {
    const { user, error } = await supabaseClient.auth.api.getUser(
      req.headers.token as string,
    );

    if (!user) {
      throw new Error(
        error?.message ?? "Must be authenticated to use this endpoint",
      );
    }
  }
}
