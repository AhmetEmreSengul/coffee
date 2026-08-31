import { test, expect } from "@playwright/test";

test.describe.serial("order", () => {
  test("user can login navigate the menu and place an order", async ({
    page,
  }) => {
    await page.goto("http://localhost:5173");

    await page.getByRole("link", { name: "Login" }).click();

    await page
      .getByPlaceholder("coffee@gmail.com")
      .fill("fake.user@example.com");
    await page.getByPlaceholder("Password").fill("hashed-test-password");

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByRole("button", { name: "close" })).toBeVisible();

    await page.getByRole("button", { name: "close" }).click();

    await expect(page).toHaveURL("http://localhost:5173");
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();

    await page.getByRole("link", { name: "Explore The Menu" }).click();

    await page.getByText("Add to Cart").first().click();
    await page.getByRole("button").nth(4).click();
    await page.getByRole("link", { name: "1" }).click();

    await page.getByRole("textbox", { name: "Order Note" }).fill("test note");
    await page
      .getByTestId("card-number")
      .locator("iframe")
      .contentFrame()
      .getByRole("textbox")
      .fill("4242424242424242");

    await page
      .getByTestId("card-expiry")
      .locator("iframe")
      .contentFrame()
      .getByRole("textbox")
      .fill("1230");

    await page
      .getByTestId("card-cvc")
      .locator("iframe")
      .contentFrame()
      .getByRole("textbox")
      .fill("123");

    await expect(page.getByRole("button", { name: "Pay 220₺" })).toBeEnabled();

    await page.getByRole("button", { name: "Pay 220₺" }).click();

    await expect(page.getByText("Order Created")).toBeVisible();
  });

  test("user can login and check order history", async ({ page }) => {
    await page.goto("http://localhost:5173");

    await page.getByRole("link", { name: "Login" }).click();

    await page
      .getByPlaceholder("coffee@gmail.com")
      .fill("fake.user@example.com");
    await page.getByPlaceholder("Password").fill("hashed-test-password");

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByRole("button", { name: "close" })).toBeVisible();

    await page.getByRole("button", { name: "close" }).click();

    await expect(page).toHaveURL("http://localhost:5173");
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();

    await page.getByRole("link", { name: "Order History" }).click();

    await expect(page.getByRole("radio").first()).toBeVisible();
  });

  test("user can login in and order again from order history", async ({
    page,
  }) => {
    await page.goto("http://localhost:5173");

    await page.getByRole("link", { name: "Login" }).click();

    await page
      .getByPlaceholder("coffee@gmail.com")
      .fill("fake.user@example.com");
    await page.getByPlaceholder("Password").fill("hashed-test-password");

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByRole("button", { name: "close" })).toBeVisible();

    await page.getByRole("button", { name: "close" }).click();

    await expect(page).toHaveURL("http://localhost:5173");
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();

    await page.getByRole("link", { name: "Order History" }).click();
    await page.getByRole("radio").first().click();
    await page.getByRole("button", { name: "Order Again" }).click();

    await page.getByRole("link", { name: "1" }).click();

    await page.getByRole("textbox", { name: "Order Note" }).fill("test note");
    await page
      .getByTestId("card-number")
      .locator("iframe")
      .contentFrame()
      .getByRole("textbox")
      .fill("4242424242424242");

    await page
      .getByTestId("card-expiry")
      .locator("iframe")
      .contentFrame()
      .getByRole("textbox")
      .fill("1230");

    await page
      .getByTestId("card-cvc")
      .locator("iframe")
      .contentFrame()
      .getByRole("textbox")
      .fill("123");

    await expect(page.getByRole("button", { name: "close" })).toBeVisible();
    await page.getByRole("button", { name: "close" }).click();

    await expect(page.getByRole("button", { name: "Pay 220₺" })).toBeEnabled();

    await page.getByRole("button", { name: "Pay 220₺" }).click();

    await expect(page.getByText("Order Created")).toBeVisible();
  });

  test("user can login and delete an order", async ({ page }) => {
    await page.goto("http://localhost:5173");

    await page.getByRole("link", { name: "Login" }).click();

    await page
      .getByPlaceholder("coffee@gmail.com")
      .fill("fake.user@example.com");
    await page.getByPlaceholder("Password").fill("hashed-test-password");

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByRole("button", { name: "close" })).toBeVisible();

    await page.getByRole("button", { name: "close" }).click();

    await expect(page).toHaveURL("http://localhost:5173");
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();

    await page.getByRole("link", { name: "Order History" }).click();
    await page.getByRole("radio").first().click();
    await page.getByRole("button", { name: "Delete" }).click();
    await page.getByRole("button", { name: "Yes I'm sure." }).click();

    await expect(page.getByText("Order deleted.")).toBeVisible();
  });
});
