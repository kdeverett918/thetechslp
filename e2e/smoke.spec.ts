import { test, expect } from '@playwright/test';

test('home page loads with primary content', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/.+/);
    await expect(page.getByRole('heading', { name: 'CLINICAL DEPTH.' })).toBeVisible();
});

test('mobile nav opens, closes, and jumps to contact', async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) >= 768, 'mobile-only flow');

    await page.goto('/');

    const mobileMenuPanel = page.locator('#mobile-menu');
    const openButton = page.getByRole('button', { name: 'Open menu' });

    await expect(openButton).toBeVisible();
    await expect(mobileMenuPanel).toHaveAttribute('aria-hidden', 'true');

    await openButton.click();
    const closeButton = page.getByRole('button', { name: 'Close menu' });
    await expect(closeButton).toBeVisible();
    await expect(mobileMenuPanel).toHaveAttribute('aria-hidden', 'false');

    await closeButton.click();
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible();
    await expect(mobileMenuPanel).toHaveAttribute('aria-hidden', 'true');

    await page.getByRole('button', { name: 'Open menu' }).click();
    const mobileNavDialog = page.getByRole('dialog', { name: 'Navigation menu' });
    await mobileNavDialog.getByRole('link', { name: 'Contact' }).click();

    await expect(page).toHaveURL(/#contact$/);
    await expect(page.getByRole('heading', { name: "LET'S BUILD SOMETHING BETTER." })).toBeInViewport();
});

test('prompt search can match body text keyword', async ({ page }) => {
    await page.goto('/prompts');

    const searchInput = page.getByRole('textbox', { name: 'Search prompts' });
    await expect(searchInput).toBeVisible();

    await searchInput.fill('quasi-identifier');

    await expect(page.getByRole('heading', { name: 'Privacy-Safe Documentation Review' })).toBeVisible();
    await expect(page.getByText(/^Showing 1 of \d+ prompts$/)).toBeVisible();
});

test('prompt search shows no-results state', async ({ page }) => {
    await page.goto('/prompts');

    const searchInput = page.getByRole('textbox', { name: 'Search prompts' });
    await expect(searchInput).toBeVisible();

    await searchInput.fill('zzzz-no-prompt-match-2026');

    await expect(page.getByText(/^Showing 0 of \d+ prompts$/)).toBeVisible();
    await expect(page.getByText('No prompts found')).toBeVisible();
    await expect(page.getByText('Try adjusting your search or clearing the category filters.')).toBeVisible();
});

test('404 page can navigate back home', async ({ page }) => {
    await page.goto('/this-route-should-404');

    await expect(page.getByRole('heading', { name: 'Page Not Found' })).toBeVisible();
    await page.getByRole('link', { name: 'Back to Home' }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('heading', { name: 'CLINICAL DEPTH.' })).toBeVisible();
});
