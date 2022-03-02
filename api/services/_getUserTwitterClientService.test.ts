import { expect, test } from "vitest";
import { TwitterAuth } from "../../src/types";
import { isExpired } from "./_getUserTwitterClientService";

const user: TwitterAuth = {
  id: "",
  session_id: "",
  access_token: "asdfsadfbadbfE",
  expires_in: 7200,
  refresh_token: "asdasdasdasdasdas",
  username: "Username",
  created_at: "2022-02-21T19:09:47.017953+00:00",
};

const notExpiredUser: TwitterAuth = {
  ...user,
  created_at: new Date().toISOString(),
};
test("isExpired", () => {
  expect(isExpired(user)).toBe(true);
  expect(isExpired(notExpiredUser)).toBe(false);
});
