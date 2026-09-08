// ============================================================
// SmartResume AI — Per-User AI Rate Limiter (SERVER-SIDE ONLY)
// In-memory sliding window rate limiter with daily caps
// ============================================================

interface UserRateData {
  timestamps: number[]
  dailyCount: number
  dailyResetAt: number
}

const DAILY_LIMIT = 100          // Max AI calls per user per day
const BURST_LIMIT = 10           // Max calls per minute (burst protection)
const BURST_WINDOW_MS = 60_000   // 1 minute window

// In-memory store — resets on server restart (acceptable for serverless)
const userRates = new Map<string, UserRateData>()

// Cleanup stale entries every 10 minutes
let lastCleanup = Date.now()
const CLEANUP_INTERVAL = 10 * 60_000

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now

  const staleThreshold = now - 24 * 60 * 60_000
  for (const [userId, data] of userRates.entries()) {
    if (data.dailyResetAt < staleThreshold) {
      userRates.delete(userId)
    }
  }
}

function getOrCreateUserData(userId: string): UserRateData {
  const now = Date.now()
  let data = userRates.get(userId)

  if (!data) {
    data = {
      timestamps: [],
      dailyCount: 0,
      dailyResetAt: getNextMidnight(),
    }
    userRates.set(userId, data)
  }

  // Reset daily count if past midnight
  if (now >= data.dailyResetAt) {
    data.dailyCount = 0
    data.dailyResetAt = getNextMidnight()
    data.timestamps = []
  }

  return data
}

function getNextMidnight(): number {
  const now = new Date()
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
  return tomorrow.getTime()
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  dailyRemaining: number
  retryAfterMs?: number
}

export function checkAIRateLimit(userId: string): RateLimitResult {
  cleanup()

  const now = Date.now()
  const data = getOrCreateUserData(userId)

  // Check daily limit
  if (data.dailyCount >= DAILY_LIMIT) {
    const retryAfterMs = data.dailyResetAt - now
    return {
      allowed: false,
      remaining: 0,
      dailyRemaining: 0,
      retryAfterMs,
    }
  }

  // Clean old timestamps outside burst window
  data.timestamps = data.timestamps.filter((ts) => now - ts < BURST_WINDOW_MS)

  // Check burst limit
  if (data.timestamps.length >= BURST_LIMIT) {
    const oldestInWindow = data.timestamps[0]
    const retryAfterMs = BURST_WINDOW_MS - (now - oldestInWindow)
    return {
      allowed: false,
      remaining: 0,
      dailyRemaining: DAILY_LIMIT - data.dailyCount,
      retryAfterMs,
    }
  }

  return {
    allowed: true,
    remaining: BURST_LIMIT - data.timestamps.length,
    dailyRemaining: DAILY_LIMIT - data.dailyCount,
  }
}

export function recordAIUsageForRateLimit(userId: string): void {
  const data = getOrCreateUserData(userId)
  data.timestamps.push(Date.now())
  data.dailyCount++
}
