import { test, expect } from '@playwright/test';

const prices = [
  { currency: 'ETH', price: 2000, date: '2023-08-30' },
  { currency: 'USDC', price: 1, date: '2023-08-30' },
  { currency: 'BTC', price: 30000, date: '2023-08-30' },
];

async function mockPrices(page) {
  await page.route('**/prices.json', (route) => route.fulfill({ json: prices }));
}

test('quotes, validates, reverses and completes a simulated swap', async ({ page }) => {
  await mockPrices(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Swap', exact: true })).toBeVisible();
  await expect(page.locator('#from-token')).toHaveAccessibleName('Choose token to send: ETH');
  await expect(page.locator('#to-token')).toHaveAccessibleName('Choose token to receive: USDC');
  await expect(page.locator('#output-amount')).toHaveValue('2,000');
  await page.getByLabel('You send', { exact: true }).fill('-2');
  await expect(page.locator('#amount-error')).toContainText('positive amount');
  await expect(page.locator('#confirm')).toBeDisabled();
  await page.getByLabel('You send', { exact: true }).fill('2.5');
  await expect(page.locator('#output-amount')).toHaveValue('5,000');
  await page.getByRole('button', { name: 'Reverse swap direction' }).click();
  await expect(page.locator('#output-amount')).toHaveValue('0.00125');
  await page.locator('#confirm').click();
  await expect(page.locator('#input-amount')).toBeDisabled();
  await expect(page.locator('#swap-status')).toContainText('Demo complete: 2.5 USDC → 0.00125 ETH. No funds were moved.');
  await expect(page.locator('#input-amount')).toBeEnabled();
});

test('searches tokens, handles same-token selection and restores keyboard focus', async ({ page }) => {
  await mockPrices(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Choose token to send' }).click();
  const search = page.getByRole('searchbox');
  await expect(search).toBeFocused();
  await search.fill('missing');
  await expect(page.getByText('No tokens found. Try another symbol.')).toBeVisible();
  await search.fill('USDC');
  await page.getByRole('button', { name: 'USDC', exact: true }).click();
  await expect(page.locator('#from-token')).toHaveAccessibleName('Choose token to send: USDC');
  await expect(page.locator('#from-token')).toContainText('USDC');
  await expect(page.locator('#to-token')).toContainText('ETH');
  await expect(page.locator('#from-token')).toBeFocused();
  await page.locator('#from-token').click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('#from-token')).toBeFocused();
});

test('recovers from a failed price request', async ({ page }) => {
  let available = false;
  await page.route('**/prices.json', (route) => available
    ? route.fulfill({ json: prices })
    : route.fulfill({ status: 503 }));
  await page.goto('/');
  await expect(page.getByText('We couldn’t load token prices. Please try again.')).toBeVisible();
  await expect(page.locator('#input-amount')).toBeDisabled();
  available = true;
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.locator('#output-amount')).toHaveValue('2,000');
});

test('handles an empty price feed', async ({ page }) => {
  await page.route('**/prices.json', (route) => route.fulfill({ json: [] }));
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
  await expect(page.locator('#confirm')).toBeDisabled();
});

test('fits a small mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await mockPrices(page);
  await page.goto('/');
  await expect(page.locator('#output-amount')).toHaveValue('2,000');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.locator('#to-token').click();
  await expect(page.getByRole('dialog')).toBeVisible();
});
