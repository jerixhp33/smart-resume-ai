// ============================================================
// SmartResume AI — Groq API Key Manager
// SERVER-SIDE ONLY — Never import in client code
// ============================================================

interface KeyHealth {
  key: string
  isHealthy: boolean
  failureCount: number
  lastFailedAt: number | null
  cooldownUntil: number | null
  requestCount: number
}

const COOLDOWN_MS = 60_000      // 1 min cooldown after failure
const MAX_FAILURES = 3          // failures before cooldown
const COOLDOWN_RESET_MS = 300_000 // 5 min before resetting failure count

class GroqKeyManager {
  private keys: KeyHealth[] = []
  private currentIndex = 0

  constructor() {
    this.loadKeys()
  }

  private loadKeys(): void {
    const keyPrefixes = ['GROQ_API_KEY_1', 'GROQ_API_KEY_2', 'GROQ_API_KEY_3',
                         'GROQ_API_KEY_4', 'GROQ_API_KEY_5']
    // Also support single GROQ_API_KEY
    const singleKey = process.env.GROQ_API_KEY
    const allKeys: string[] = []

    if (singleKey && singleKey !== 'placeholder-groq-key') {
      allKeys.push(singleKey)
    }

    for (const prefix of keyPrefixes) {
      const key = process.env[prefix]
      if (key && key.startsWith('gsk_')) {
        allKeys.push(key)
      }
    }

    this.keys = allKeys.map(key => ({
      key,
      isHealthy: true,
      failureCount: 0,
      lastFailedAt: null,
      cooldownUntil: null,
      requestCount: 0,
    }))

    if (this.keys.length === 0) {
      console.warn('[KeyManager] No valid Groq API keys configured. AI features will be unavailable.')
    } else {
      console.info(`[KeyManager] Initialized with ${this.keys.length} key(s)`)
    }
  }

  getAvailableKey(): string | null {
    if (this.keys.length === 0) return null

    const now = Date.now()

    // Reset cooldowns that have expired
    for (const keyHealth of this.keys) {
      if (keyHealth.cooldownUntil && keyHealth.cooldownUntil <= now) {
        keyHealth.isHealthy = true
        keyHealth.cooldownUntil = null
        keyHealth.failureCount = 0
        console.info('[KeyManager] Key cooldown expired, marking healthy')
      }
      // Reset failure count if it's been a while
      if (keyHealth.lastFailedAt && now - keyHealth.lastFailedAt > COOLDOWN_RESET_MS) {
        keyHealth.failureCount = 0
      }
    }

    // Try round-robin starting from current index
    const startIndex = this.currentIndex
    for (let i = 0; i < this.keys.length; i++) {
      const idx = (startIndex + i) % this.keys.length
      const keyHealth = this.keys[idx]
      if (keyHealth.isHealthy) {
        this.currentIndex = (idx + 1) % this.keys.length
        keyHealth.requestCount++
        return keyHealth.key
      }
    }

    return null
  }

  reportFailure(key: string): void {
    const keyHealth = this.keys.find(k => k.key === key)
    if (!keyHealth) return

    keyHealth.failureCount++
    keyHealth.lastFailedAt = Date.now()

    if (keyHealth.failureCount >= MAX_FAILURES) {
      keyHealth.isHealthy = false
      keyHealth.cooldownUntil = Date.now() + COOLDOWN_MS
      console.warn('[KeyManager] Key entered cooldown after repeated failures')
    }
  }

  reportSuccess(key: string): void {
    const keyHealth = this.keys.find(k => k.key === key)
    if (!keyHealth) return
    keyHealth.failureCount = 0
    keyHealth.lastFailedAt = null
  }

  getStatus(): { total: number; healthy: number; in_cooldown: number } {
    const healthy = this.keys.filter(k => k.isHealthy).length
    const inCooldown = this.keys.filter(k => !k.isHealthy).length
    return { total: this.keys.length, healthy, in_cooldown: inCooldown }
  }

  hasKeys(): boolean {
    return this.keys.length > 0
  }
}

// Singleton — server module scope
let keyManagerInstance: GroqKeyManager | null = null

export function getKeyManager(): GroqKeyManager {
  if (!keyManagerInstance) {
    keyManagerInstance = new GroqKeyManager()
  }
  return keyManagerInstance
}
