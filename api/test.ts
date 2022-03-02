import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function test(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json(["hello"]);
}
