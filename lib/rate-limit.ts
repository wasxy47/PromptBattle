export class RateLimiter {
  private tokenCache = new Map<string, { count: number; timestamp: number }>()
  
  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {}

  public check(ip: string): { success: boolean; limit: number; remaining: number } {
    const now = Date.now()
    const record = this.tokenCache.get(ip)

    // Clean up old entries occasionally to prevent memory leaks in long-running instances
    if (this.tokenCache.size > 1000) {
      const expiration = now - this.windowMs
      for (const [key, value] of Array.from(this.tokenCache.entries())) {
        if (value.timestamp < expiration) {
          this.tokenCache.delete(key)
        }
      }
    }

    if (!record) {
      this.tokenCache.set(ip, { count: 1, timestamp: now })
      return { success: true, limit: this.maxRequests, remaining: this.maxRequests - 1 }
    }

    if (now - record.timestamp > this.windowMs) {
      // Reset window
      record.count = 1
      record.timestamp = now
      return { success: true, limit: this.maxRequests, remaining: this.maxRequests - 1 }
    }

    if (record.count >= this.maxRequests) {
      return { success: false, limit: this.maxRequests, remaining: 0 }
    }

    record.count += 1
    return { success: true, limit: this.maxRequests, remaining: this.maxRequests - record.count }
  }
}

// Global instance: Max 5 battles per minute per IP
export const battleRateLimiter = new RateLimiter(5, 60 * 1000)
