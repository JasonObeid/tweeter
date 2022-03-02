import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://tweeter-khaki.vercel.app/");
});

test.describe("Visiting the home page", () => {
  test("should load without errors", async ({ page }) => {
    expect(page.title).toBe("Tweeter");
  });
});
