import { expect, test } from "@playwright/test";

test("redirects anonymous visitors to the login page", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveURL(/\/auth\/login$/);
});

test("renders the login form", async ({ page }) => {
  await page.goto("/auth/login");

  await expect(page.getByText("С возвращением")).toBeVisible();
  // Labels must be wired to the inputs (FormLabel htmlFor → FormControl id).
  const panel = page.getByRole("tabpanel", { name: "Пароль" });
  await expect(panel.getByLabel("Электронная почта")).toHaveAttribute(
    "type",
    "email",
  );
  await expect(panel.getByLabel("Пароль", { exact: true })).toHaveAttribute(
    "type",
    "password",
  );
  await expect(page.getByRole("button", { name: "Войти" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Забыли пароль?" }),
  ).toBeVisible();
});
