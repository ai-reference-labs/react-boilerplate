import { test, expect } from '@playwright/test';

test('opens App 1 before sign-on', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: /One application/ }),
  ).toBeVisible();
  await page.getByRole('link', { name: /Run the sample journey/ }).click();
  await expect(
    page.getByRole('heading', { name: 'App 1 workbench' }),
  ).toBeVisible();
});

test('requires sign-on before opening App 2', async ({ page }) => {
  await page.goto('/app2');
  await expect(
    page.getByRole('heading', { name: 'Continue to App 2.' }),
  ).toBeVisible();

  await page.getByRole('button', { name: /Sign in and open App 2/ }).click();
  await expect(
    page.getByRole('heading', { name: 'App 2 workbench' }),
  ).toBeVisible();
});
