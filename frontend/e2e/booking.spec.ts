import { test, expect } from "@playwright/test";

test.describe("booking", () => {
  test("user can login and book a table", async ({ page, browserName }) => {
    const tableMap: Record<string, string> = {
      chromium: "T2",
      firefox: "T3",
      webkit: "T4",
    };

    await page.goto("http://localhost:5173");

    await page.getByRole("link", { name: "Login" }).click();

    await page
      .getByPlaceholder("coffee@gmail.com")
      .fill("fake.user@example.com");
    await page.getByPlaceholder("Password").fill("hashed-test-password");

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL("http://localhost:5173");
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();

    await page.getByRole("link", { name: "Book a Table" }).nth(1).click();
    await page.getByText(tableMap[browserName]).click();
    await page.getByRole("button", { name: "Thursday, August 6th," }).click();
    await page
      .locator("div")
      .filter({ hasText: /^09:00 \/11:00$/ })
      .click();
    await page.getByRole("button", { name: "Create Booking" }).click();

    await expect(page.getByText("Booking Created")).toBeVisible();
  });

  test("user can log in and check active bookings", async ({ page }) => {
    await page.goto("http://localhost:5173");

    await page.getByRole("link", { name: "Login" }).click();

    await page
      .getByPlaceholder("coffee@gmail.com")
      .fill("fake.user@example.com");
    await page.getByPlaceholder("Password").fill("hashed-test-password");

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL("http://localhost:5173");
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();

    await page.getByRole("link", { name: "My Bookings" }).click();

    await expect(page.getByText("BOOKING ID").first()).toBeVisible();
  });

  test("user can log in and delete a booking", async ({ page }) => {
    await page.goto("http://localhost:5173");

    await page.getByRole("link", { name: "Login" }).click();

    await page
      .getByPlaceholder("coffee@gmail.com")
      .fill("fake.user@example.com");
    await page.getByPlaceholder("Password").fill("hashed-test-password");

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL("http://localhost:5173");
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();

    await page.getByRole("link", { name: "My Bookings" }).click();

    await expect(page.getByText("BOOKING ID").first()).toBeVisible();

    await page.getByRole("button", { name: "Delete" }).first().click();

    await page.getByRole("button", { name: "Yes I'm sure." }).click();

    await expect(page.getByText("Cancelled booking")).toBeVisible();
  });
});
