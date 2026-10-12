import { test, expect, type Page } from '@playwright/test';

// Helper functions
async function goToCategories(page: Page) {
  await page.goto('/categories');
  await page.waitForLoadState('networkidle');
}

async function goToTransactions(page: Page) {
  await page.goto('/transactions');
  await page.waitForLoadState('networkidle');
}

async function goToDashboard(page: Page) {
  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');
}

async function addCategory(page: Page, name: string, icon: string, color: string) {
  await page.getByRole('button', { name: 'Add Category' }).first().click();
  await page.getByLabel('Name *').fill(name);
  // Open icon picker and select the specified icon (PascalCase names like Utensils, Gamepad2)
  await page.getByRole('button', { name: /Select icon|Utensils/i }).click();
  await page.getByRole('option', { name: icon }).click();
  await page.keyboard.press('Tab');
  await page.waitForTimeout(200);
  // Set color
  await page.locator('input[type="color"]').fill(color);
  // Click Create
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByText(name)).toBeVisible({ timeout: 5000 });
}

async function addTransaction(page: Page, amount: number, categoryName: string, note: string) {
  await page.getByRole('button', { name: 'Add Transaction' }).first().click();
  await page.getByLabel('Amount *').fill(amount.toString());
  // Select category
  await page.getByRole('button', { name: /Select category/i }).click();
  await page.getByRole('option', { name: categoryName }).click();
  // Date should be today by default
  if (note) {
    await page.getByLabel('Note (optional)').fill(note);
  }
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByText(note || amount.toString())).toBeVisible({ timeout: 5000 });
}

async function editTransaction(
  page: Page,
  originalNote: string,
  newAmount: number,
  newNote: string
) {
  // Find the row with the original note and click edit
  const row = page.locator('tr', { hasText: originalNote });
  await row.getByRole('button', { name: 'Edit transaction' }).click();
  await page.getByLabel('Amount *').fill(newAmount.toString());
  if (newNote) {
    await page.getByLabel('Note (optional)').fill(newNote);
  }
  await page.getByRole('button', { name: 'Update' }).click();
  await expect(page.getByText(newNote || newAmount.toString())).toBeVisible({ timeout: 5000 });
}

test.describe.configure({ retries: 2 });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
});

test.describe('E2E Tests', () => {
  test('Flow 1: Create category → create transaction → verify on dashboard', async ({ page }) => {
    await goToCategories(page);

    // Add category "Food" (Utensils, #FF5733)
    await addCategory(page, 'Food', 'Utensils', '#FF5733');

    // Add transaction -25.50, Food, today, "Lunch"
    await goToTransactions(page);
    await addTransaction(page, -25.5, 'Food', 'Lunch');

    // Dashboard shows chart with data
    await goToDashboard(page);

    // Verify charts render without error (check for chart headings)
    await expect(page.getByRole('heading', { name: 'Spending by Category' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Income vs Expense' })).toBeVisible();

    // Verify the spending chart exists (1 category)
    const spendingChart = page.getByRole('img', {
      name: /Spending by category chart with 1 categor/,
    });
    await expect(spendingChart).toBeVisible();

    // Verify expense amount in doughnut chart aria-label
    const doughnutChart = page.getByRole('img', { name: /Expense: \$25\.50/ });
    await expect(doughnutChart).toBeVisible();
  });

  test('Flow 2: Edit transaction → verify update', async ({ page }) => {
    await goToCategories(page);
    await addCategory(page, 'Transport', 'Bus', '#3B82F6');

    // Add transaction -10.00, Transport, "Bus"
    await goToTransactions(page);
    await addTransaction(page, -10, 'Transport', 'Bus');

    // Edit to -15.00, "Bus + subway"
    await editTransaction(page, 'Bus', -15, 'Bus + subway');

    // List and dashboard reflect new total
    await goToTransactions(page);
    await expect(page.getByText('Bus + subway')).toBeVisible();
    // Amount shows as -15.00 for expense (no $ sign in table)
    await expect(page.getByText('-15.00')).toBeVisible();

    await goToDashboard(page);
    // Dashboard shows updated expense in chart aria-label
    const doughnutChart = page.getByRole('img', { name: /Expense: \$15\.00/ });
    await expect(doughnutChart).toBeVisible();
  });

  test('Flow 3: Delete category with transactions → blocked', async ({ page }) => {
    await goToCategories(page);

    // Add category "Entertainment"
    await addCategory(page, 'Entertainment', 'Gamepad2', '#8B5CF6');

    // Add transaction with Entertainment category
    await goToTransactions(page);
    await addTransaction(page, -50, 'Entertainment', 'Movie');

    // Try delete category → blocked with message (cascade not implemented)
    await goToCategories(page);

    // Click delete on Entertainment category
    const entertainmentRow = page.locator('div', { hasText: 'Entertainment' }).first();

    // Handle the native confirm dialog
    page.on('dialog', async (dialog) => {
      expect(dialog.type()).toBe('confirm');
      expect(dialog.message()).toContain('Delete "Entertainment"');
      await dialog.accept();
    });

    await entertainmentRow.getByRole('button', { name: 'Delete category' }).click();

    // After accepting confirm, check for error toast/message
    await expect(page.getByText('Cannot delete category with existing transactions')).toBeVisible({
      timeout: 5000,
    });

    // Category should still exist
    await expect(page.getByText('Entertainment')).toBeVisible();
  });

  test('Flow 4: Switch tabs → verify persistence', async ({ page }) => {
    await goToCategories(page);
    await addCategory(page, 'Food', 'Utensils', '#FF5733');

    await goToTransactions(page);
    await addTransaction(page, -25.5, 'Food', 'Lunch');

    // Navigate Dashboard → Transactions → Categories → Dashboard
    await goToDashboard(page);
    await expect(page.getByRole('heading', { name: 'Spending by Category' })).toBeVisible();

    await goToTransactions(page);
    await expect(page.getByText('Lunch')).toBeVisible();

    await goToCategories(page);
    await expect(page.getByText('Food')).toBeVisible();

    await goToDashboard(page);
    await expect(page.getByRole('heading', { name: 'Spending by Category' })).toBeVisible();

    // Refresh page → data persists (IndexedDB)
    await page.reload();
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: 'Spending by Category' })).toBeVisible();
    // Verify data still in IndexedDB by checking categories page
    await goToCategories(page);
    await expect(page.getByText('Food')).toBeVisible();

    await goToTransactions(page);
    await expect(page.getByText('Lunch')).toBeVisible();
  });

  test('Flow 5: Mobile viewport (375x667)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Create test data first
    await goToCategories(page);
    await addCategory(page, 'Food', 'Utensils', '#FF5733');

    await goToTransactions(page);
    await addTransaction(page, -25.5, 'Food', 'Lunch');

    // All 3 pages usable, no horizontal scroll
    await goToCategories(page);
    const categoriesBody = page.locator('body');
    const bodyWidth = await categoriesBody.evaluate((el: HTMLElement) => el.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375);

    await goToTransactions(page);
    const transactionsBody = page.locator('body');
    const transactionsWidth = await transactionsBody.evaluate((el: HTMLElement) => el.scrollWidth);
    expect(transactionsWidth).toBeLessThanOrEqual(375);

    await goToDashboard(page);
    const dashboardBody = page.locator('body');
    const dashboardWidth = await dashboardBody.evaluate((el: HTMLElement) => el.scrollWidth);
    expect(dashboardWidth).toBeLessThanOrEqual(375);

    // Navigation is accessible
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();

    // Forms fit, charts readable
    await goToCategories(page);
    await page.getByRole('button', { name: 'Add Category' }).first().click();
    const form = page.locator('form');
    await expect(form).toBeVisible();

    const formWidth = await form.evaluate((el: HTMLElement) => el.scrollWidth);
    expect(formWidth).toBeLessThanOrEqual(375);

    await page.getByRole('button', { name: 'Cancel' }).click();

    // Verify charts render on mobile (check headings)
    await goToDashboard(page);
    await expect(page.getByRole('heading', { name: 'Spending by Category' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Income vs Expense' })).toBeVisible();
  });
});
