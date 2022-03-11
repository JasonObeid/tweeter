import pino from "pino";
import { logflarePinoVercel } from "pino-logflare";

// create pino-logflare console stream for serverless functions and send function for browser logs
const { stream, send } = logflarePinoVercel({
  apiKey: process.env.NEXT_PUBLIC_LOGFLARE_KEY as string,
  sourceToken: process.env.NEXT_PUBLIC_LOGFLARE_STREAM_ID as string,
});

// create pino loggger
export const logger = pino(
  {
    browser: {
      transmit: {
        level: "info",
        send: send,
      },
    },
    level: "debug",
    base: {
      env: process.env.VERCEL_ENV,
      revision: process.env.VERCEL_GITHUB_COMMIT_SHA,
    },
  },
  stream,
);
