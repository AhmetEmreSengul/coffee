import { test, expect } from "@playwright/test";

test.describe.serial("admin", () => {
  test("user can login as an admin and navigate to admin dashboard", async ({
    page,
  }) => {
    await page.goto("http://localhost:5173");

    await page.getByRole("link", { name: "Login" }).click();
    await page
      .getByPlaceholder("coffee@gmail.com")
      .fill(process.env.E2E_ADMIN_EMAIL as string);
    await page
      .getByPlaceholder("Password")
      .fill(process.env.E2E_ADMIN_PASSWORD as string);

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL("http://localhost:5173");
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();

    await page.reload();
    await expect(
      page.getByRole("link", { name: "Admin Dashboard" }),
    ).toBeVisible();

    await page.goto("http://localhost:5173/admin");

    await expect(page.getByText("Admin Dashboard Logged in as")).toBeVisible();
  });

  test("user can login as an admin and see all users and view an users orders and bookings", async ({
    page,
  }) => {
    await page.goto("http://localhost:5173");

    await page.getByRole("link", { name: "Login" }).click();
    await page
      .getByPlaceholder("coffee@gmail.com")
      .fill(process.env.E2E_ADMIN_EMAIL as string);
    await page
      .getByPlaceholder("Password")
      .fill(process.env.E2E_ADMIN_PASSWORD as string);

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL("http://localhost:5173");
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();

    await page.reload();
    await expect(
      page.getByRole("link", { name: "Admin Dashboard" }),
    ).toBeVisible();

    await page.goto("http://localhost:5173/admin");

    await expect(page.getByText("Admin Dashboard Logged in as")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();
    await page.getByRole("link", { name: "Activity" }).first().click();

    await expect(
      page.getByRole("heading", { name: "User Orders" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "User Bookings" }),
    ).toBeVisible();
  });

  test("user can login as an admin and ban an user", async ({ page }) => {
    await page.goto("http://localhost:5173");

    await page.getByRole("link", { name: "Login" }).click();
    await page
      .getByPlaceholder("coffee@gmail.com")
      .fill(process.env.E2E_ADMIN_EMAIL as string);
    await page
      .getByPlaceholder("Password")
      .fill(process.env.E2E_ADMIN_PASSWORD as string);

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL("http://localhost:5173");
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();

    await page.reload();
    await expect(
      page.getByRole("link", { name: "Admin Dashboard" }),
    ).toBeVisible();

    await page.goto("http://localhost:5173/admin");

    await expect(page.getByText("Admin Dashboard Logged in as")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();
    await page.getByRole("button", { name: "Ban User" }).first().click();

    await expect(page.getByText("User Updated")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Unban User" }),
    ).toBeVisible();
  });

  test("user can login as an admin and unban an user", async ({ page }) => {
    await page.goto("http://localhost:5173");

    await page.getByRole("link", { name: "Login" }).click();
    await page
      .getByPlaceholder("coffee@gmail.com")
      .fill(process.env.E2E_ADMIN_EMAIL as string);
    await page
      .getByPlaceholder("Password")
      .fill(process.env.E2E_ADMIN_PASSWORD as string);

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL("http://localhost:5173");
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();

    await page.reload();
    await expect(
      page.getByRole("link", { name: "Admin Dashboard" }),
    ).toBeVisible();

    await page.goto("http://localhost:5173/admin");

    await expect(page.getByText("Admin Dashboard Logged in as")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();
    await page.getByRole("button", { name: "Unban User" }).first().click();

    await expect(page.getByText("User Updated")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Ban User" }).first(),
    ).toBeVisible();
  });

  test("user can login as an admin and add a coffee", async ({ page }) => {
    await page.goto("http://localhost:5173");

    await page.getByRole("link", { name: "Login" }).click();
    await page
      .getByPlaceholder("coffee@gmail.com")
      .fill(process.env.E2E_ADMIN_EMAIL as string);
    await page
      .getByPlaceholder("Password")
      .fill(process.env.E2E_ADMIN_PASSWORD as string);

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL("http://localhost:5173");
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();

    await page.reload();
    await expect(
      page.getByRole("link", { name: "Admin Dashboard" }),
    ).toBeVisible();

    await page.goto("http://localhost:5173/admin");

    await expect(page.getByText("Admin Dashboard Logged in as")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();

    await page.getByRole("link", { name: "Manage Coffees" }).click();
    await expect(
      page.getByRole("heading", { name: "All Coffees" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Add New Coffee" }).click();
    await page.getByRole("textbox", { name: "Title" }).fill("Test Coffee");
    await page.getByRole("combobox").selectOption("Hot");
    await page.getByRole("spinbutton", { name: "Price" }).fill("10");
    await page
      .getByRole("textbox", { name: "Image" })
      .fill("https://via.placeholder.com/150");
    await page
      .getByRole("textbox", { name: "Description" })
      .fill("This is a test coffee");
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByText("Coffee added.")).toBeVisible();
  });

  test("user can login as an admin and edit a coffee", async ({ page }) => {
    await page.goto("http://localhost:5173");

    await page.getByRole("link", { name: "Login" }).click();
    await page
      .getByPlaceholder("coffee@gmail.com")
      .fill(process.env.E2E_ADMIN_EMAIL as string);
    await page
      .getByPlaceholder("Password")
      .fill(process.env.E2E_ADMIN_PASSWORD as string);

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL("http://localhost:5173");
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();

    await page.reload();
    await expect(
      page.getByRole("link", { name: "Admin Dashboard" }),
    ).toBeVisible();

    await page.goto("http://localhost:5173/admin");

    await expect(page.getByText("Admin Dashboard Logged in as")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();

    await page.getByRole("link", { name: "Manage Coffees" }).click();
    await expect(
      page.getByRole("heading", { name: "All Coffees" }),
    ).toBeVisible();
    await page
      .locator("div:nth-child(43) > .space-x-1 > button:nth-child(2)")
      .click();

    await page.getByRole("textbox", { name: "Title" }).clear();
    await page.getByRole("textbox", { name: "Title" }).fill("Updated Coffee");
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByText("Coffee edited.")).toBeVisible();
  });

  test("user can login as an admin and delete a coffee", async ({ page }) => {
    await page.goto("http://localhost:5173");

    await page.getByRole("link", { name: "Login" }).click();
    await page
      .getByPlaceholder("coffee@gmail.com")
      .fill(process.env.E2E_ADMIN_EMAIL as string);
    await page
      .getByPlaceholder("Password")
      .fill(process.env.E2E_ADMIN_PASSWORD as string);

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL("http://localhost:5173");
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();

    await page.reload();
    await expect(
      page.getByRole("link", { name: "Admin Dashboard" }),
    ).toBeVisible();

    await page.goto("http://localhost:5173/admin");

    await expect(page.getByText("Admin Dashboard Logged in as")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Users" })).toBeVisible();

    await page.getByRole("link", { name: "Manage Coffees" }).click();
    await expect(
      page.getByRole("heading", { name: "All Coffees" }),
    ).toBeVisible();
    await page
      .locator("div:nth-child(43) > .space-x-1 > .p-1.border.text-red-500")
      .click();
    await page.getByRole("button", { name: "Confirm" }).click();

    await expect(page.getByText("Coffee deleted.")).toBeVisible();
  });
});
