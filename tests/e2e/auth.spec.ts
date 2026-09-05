import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('landing page loads correctly', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/SmartResume AI/)
    await expect(page.getByText("Your resume shouldn't look")).toBeVisible()
    await expect(page.getByRole('link', { name: 'Create My Resume' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Analyze My Resume' })).toBeVisible()
  })

  test('navigation to signup page works', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Get started free' }).first().click()
    await expect(page).toHaveURL(/signup/)
    await expect(page.getByText('Create your account')).toBeVisible()
  })

  test('navigation to login page works', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Sign in' }).click()
    await expect(page).toHaveURL(/login/)
    await expect(page.getByText('Welcome back')).toBeVisible()
  })

  test('signup form validates email', async ({ page }) => {
    await page.goto('/signup')
    await page.getByLabel('Full name').fill('Test User')
    await page.getByLabel('Email').fill('not-an-email')
    await page.getByLabel('Password').fill('TestPass123')
    await page.getByLabel('Confirm password').fill('TestPass123')
    await page.getByRole('button', { name: 'Create account' }).click()
    await expect(page.getByText('valid email')).toBeVisible()
  })

  test('login form validates empty fields', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page.getByText('required')).toBeVisible()
  })

  test('magic link tab works', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: 'Magic Link' }).click()
    await expect(page.getByRole('button', { name: 'Send magic link' })).toBeVisible()
  })

  test('unauthenticated user redirected from dashboard', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/login/)
  })

  test('unauthenticated user redirected from builder', async ({ page }) => {
    await page.goto('/builder/some-resume-id')
    await expect(page).toHaveURL(/login/)
  })

  test('features section visible on landing', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('AI Resume Builder')).toBeVisible()
    await expect(page.getByText('ATS Compatibility Score')).toBeVisible()
    await expect(page.getByText('Job Tailoring')).toBeVisible()
  })

  test('pricing section shows free and paid options', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Pricing' }).click()
    await expect(page.getByText('₹0')).toBeVisible()
    await expect(page.getByText('₹99')).toBeVisible()
    await expect(page.getByText('3 resumes (forever free)')).toBeVisible()
  })
})
