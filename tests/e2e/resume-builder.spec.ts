import { test, expect, Page } from '@playwright/test'

// Helper: authenticate as test user
async function authenticate(page: Page) {
  // In real E2E tests, use test credentials from env
  const email = process.env.TEST_USER_EMAIL || 'test@smartresume.ai'
  const password = process.env.TEST_USER_PASSWORD || 'TestPass123!'

  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.waitForURL(/dashboard|resumes/, { timeout: 10000 })
}

test.describe('Resume Builder (requires auth)', () => {
  test.skip(
    !process.env.TEST_USER_EMAIL,
    'Skipping: TEST_USER_EMAIL not configured'
  )

  test('dashboard loads after login', async ({ page }) => {
    await authenticate(page)
    await expect(page.getByText(/Good (morning|afternoon|evening)/)).toBeVisible()
    await expect(page.getByRole('link', { name: 'Create Resume' })).toBeVisible()
  })

  test('create new resume page is accessible', async ({ page }) => {
    await authenticate(page)
    await page.goto('/resumes/new')
    await expect(page.getByText('Create New Resume')).toBeVisible()
    await expect(page.getByLabel('Resume Name')).toBeVisible()
    await expect(page.getByText('ATS Classic')).toBeVisible()
  })

  test('template selector shows all templates', async ({ page }) => {
    await authenticate(page)
    await page.goto('/resumes/new')
    await expect(page.getByText('ATS Classic')).toBeVisible()
    await expect(page.getByText('ATS Modern')).toBeVisible()
    await expect(page.getByText('Student')).toBeVisible()
  })

  test('resumes list page shows all resumes', async ({ page }) => {
    await authenticate(page)
    await page.goto('/resumes')
    await expect(page.getByText('My Resumes')).toBeVisible()
  })

  test('ATS analyzer page loads', async ({ page }) => {
    await authenticate(page)
    await page.goto('/analyzer')
    await expect(page.getByText('ATS Analyzer')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Run ATS Analysis' })).toBeVisible()
  })

  test('applications page loads', async ({ page }) => {
    await authenticate(page)
    await page.goto('/applications')
    await expect(page.getByText('Job Applications')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Add Application' })).toBeVisible()
  })

  test('AI tools page loads', async ({ page }) => {
    await authenticate(page)
    await page.goto('/ai-tools')
    await expect(page.getByText('AI Tools')).toBeVisible()
    await expect(page.getByText('JD Analyzer')).toBeVisible()
    await expect(page.getByText('Interview Prep')).toBeVisible()
  })

  test('mobile navigation is visible on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await authenticate(page)
    await page.goto('/dashboard')
    // Mobile nav should be visible
    await expect(page.locator('nav.fixed.bottom-0')).toBeVisible()
  })

  test('desktop sidebar is visible on large screens', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await authenticate(page)
    await page.goto('/dashboard')
    await expect(page.locator('aside.hidden.lg\\:flex')).toBeVisible()
  })
})

test.describe('Public pages', () => {
  test('404 page is handled gracefully', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist-xyz')
    expect(response?.status()).toBe(404)
  })

  test('page has correct meta title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/SmartResume AI/)
  })
})
