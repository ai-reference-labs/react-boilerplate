import { test, expect } from '@playwright/test';

test('navigates from getting started to the intake module', async ({
  page,
}) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: /One application/ }),
  ).toBeVisible();
  await page.getByRole('link', { name: /Run the sample journey/ }).click();
  await expect(
    page.getByRole('heading', { name: 'Intake workbench' }),
  ).toBeVisible();
});
