import { expect, type Page, test } from "@playwright/test";

const PASSWORD = "e2e-password-123";

function uniqueEmail() {
  return `e2e-${crypto.randomUUID()}@example.com`;
}

async function fillPasswordForm(page: Page, email: string) {
  // Scope to the "Пароль" tab: the OTP tab has its own email field, and the
  // tab panel itself is labelled "Пароль" via aria-labelledby.
  const panel = page.getByRole("tabpanel", { name: "Пароль" });
  await panel.getByLabel("Электронная почта").fill(email);
  await panel.getByLabel("Пароль", { exact: true }).fill(PASSWORD);
}

test("signs up, keeps the session and signs back in", async ({
  page,
  browser,
}) => {
  const email = uniqueEmail();

  await page.goto("/auth/signup");
  await fillPasswordForm(page, email);
  await page.getByRole("button", { name: "Создать аккаунт" }).click();

  await expect(page).toHaveURL("/");
  await page.reload();
  await expect(page).toHaveURL("/");

  // A fresh browser context has no cookies: sign in with the same account.
  const context = await browser.newContext();
  const fresh = await context.newPage();
  await fresh.goto("/auth/login");
  await fillPasswordForm(fresh, email);
  await fresh.getByRole("button", { name: "Войти" }).click();

  await expect(fresh).toHaveURL("/");
  await context.close();
});

test("rejects unknown credentials", async ({ page }) => {
  await page.goto("/auth/login");
  await fillPasswordForm(page, uniqueEmail());
  await page.getByRole("button", { name: "Войти" }).click();

  await expect(
    page.locator("[data-sonner-toast][data-type='error']"),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/auth\/login$/);
});
