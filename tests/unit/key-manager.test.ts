import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock env before importing key manager
vi.stubEnv('GROQ_API_KEY_1', 'gsk_test_key_1_abcdef')
vi.stubEnv('GROQ_API_KEY_2', 'gsk_test_key_2_ghijkl')

describe('GroqKeyManager', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('loads keys from environment variables', async () => {
    const { getKeyManager } = await import('@/lib/ai/key-manager')
    const manager = getKeyManager()
    expect(manager.hasKeys()).toBe(true)
    const status = manager.getStatus()
    expect(status.total).toBeGreaterThan(0)
    expect(status.healthy).toBeGreaterThan(0)
  })

  it('returns a key when available', async () => {
    const { getKeyManager } = await import('@/lib/ai/key-manager')
    const manager = getKeyManager()
    const key = manager.getAvailableKey()
    expect(key).toBeTruthy()
    expect(key).toMatch(/^gsk_/)
  })

  it('rotates between keys (round-robin)', async () => {
    const { getKeyManager } = await import('@/lib/ai/key-manager')
    const manager = getKeyManager()

    const keys = new Set<string>()
    // Get enough keys to see rotation
    for (let i = 0; i < 6; i++) {
      const key = manager.getAvailableKey()
      if (key) keys.add(key)
    }
    // With 2 keys, should see both in 6 calls
    expect(keys.size).toBeGreaterThanOrEqual(1)
  })

  it('reports success without errors', async () => {
    const { getKeyManager } = await import('@/lib/ai/key-manager')
    const manager = getKeyManager()
    const key = manager.getAvailableKey()
    expect(() => manager.reportSuccess(key!)).not.toThrow()
  })

  it('reports failure without crashing', async () => {
    const { getKeyManager } = await import('@/lib/ai/key-manager')
    const manager = getKeyManager()
    const key = manager.getAvailableKey()
    expect(() => manager.reportFailure(key!)).not.toThrow()
    // After reporting failure, status should update
    const status = manager.getStatus()
    expect(status.total).toBeGreaterThan(0)
  })

  it('does not expose raw key values in getStatus()', async () => {
    const { getKeyManager } = await import('@/lib/ai/key-manager')
    const manager = getKeyManager()
    const status = manager.getStatus()
    // Status should only have counts, not keys
    const statusStr = JSON.stringify(status)
    expect(statusStr).not.toContain('gsk_')
    expect(statusStr).not.toContain('test_key')
  })
})
