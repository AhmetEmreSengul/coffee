import { test, expect } from "@playwright/test";

test.describe("auth", () => {
  test("user can navigate to login form from home page click on signup then signup successfully", async ({
    page,
  }) => {
    await page.goto("http://localhost:5173");

    await page.getByRole("link", { name: "Login" }).click();

    await page.getByRole("link", { name: "Signup" }).click();

    await page.getByPlaceholder("Full Name").fill("test");
    await page
      .getByPlaceholder("coffee@gmail.com")
      .fill(`test@${Date.now()}.com`);
    await page.getByPlaceholder("Password").fill("test123");

    await page.getByRole("button", { name: "Create Account" }).click();

    const cookies = await page.context().cookies();

    await expect(page).toHaveURL("http://localhost:5173");
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
  });
});
