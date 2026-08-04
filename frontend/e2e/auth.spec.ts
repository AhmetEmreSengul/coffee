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

    await expect(page).toHaveURL("http://localhost:5173");
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
  });

  test("user can navigate to login form from home page click on login then login successfully", async ({
    page,
  }) => {
    await page.goto("http://localhost:5173");

    await page.getByRole("link", { name: "Login" }).click();

    await page
      .getByPlaceholder("coffee@gmail.com")
      .fill("fake.user@example.com");
    await page.getByPlaceholder("Password").fill("hashed-test-password");

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL("http://localhost:5173");
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
  });

  test("a logged in user can logout", async ({ page }) => {
    await page.goto("http://localhost:5173");

    await page.getByRole("link", { name: "Login" }).click();
    await page
      .getByPlaceholder("coffee@gmail.com")
      .fill("fake.user@example.com");
    await page.getByPlaceholder("Password").fill("hashed-test-password");

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL("http://localhost:5173");
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();

    await page.getByRole("button", { name: "Logout" }).click();
    await expect(page).toHaveURL("http://localhost:5173");
    await expect(page.getByText("Logging out...")).toBeVisible();
  });
});
