import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseClient } from "./services/_getClients";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  supabaseClient.auth.api.setAuthCookie(req, res);
}
