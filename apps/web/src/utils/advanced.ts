/**
 * Enhanced Security & Performance Utilities for PokerMind
 * Advanced protections, encryption, and optimizations
 */

// ============================================
// ADVANCED SECURITY
// ============================================

/**
 * Advanced XSS Protection with DOMPurify-like behavior
 */
export function advancedSanitize(input: string): string {
  // Remove script tags
  let clean = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers
  clean = clean.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  clean = clean.replace(/on\w+\s*=\s*[^\s>]*/gi, '');

  // Remove javascript: protocol
  clean = clean.replace(/javascript:/gi, '');

  // Remove data: protocol (except images)
  clean = clean.replace(/data:(?!image)/gi, '');

  return clean;
}

/**
 * SQL Injection Prevention for user inputs
 */
export function preventSQLInjection(input: string): string {
  // Escape single quotes
  let safe = input.replace(/'/g, "''");

  // Remove SQL keywords
  const sqlKeywords = [
    'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE',
    'ALTER', 'EXEC', 'EXECUTE', 'UNION', 'DECLARE', '--', ';--'
  ];

  sqlKeywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'gi');
    safe = safe.replace(regex, '');
  });

  return safe;
}

/**
 * Secure Session Token Generator with crypto
 */
export function generateSecureToken(length: number = 64): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * IP-based Rate Limiter with exponential backoff
 */
export class AdvancedRateLimiter {
  private attempts: Map<string, { count: number; firstAttempt: number; blocked: boolean; blockUntil?: number }> = new Map();

  checkLimit(
    identifier: string,
    maxAttempts: number,
    windowMs: number,
    blockDurationMs: number = 60000
  ): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    // Check if currently blocked
    if (record?.blocked && record.blockUntil) {
      if (now < record.blockUntil) {
        return { allowed: false, retryAfter: Math.ceil((record.blockUntil - now) / 1000) };
      } else {
        // Unblock
        this.attempts.delete(identifier);
      }
    }

    // New attempt or window expired
    if (!record || (now - record.firstAttempt) > windowMs) {
      this.attempts.set(identifier, { count: 1, firstAttempt: now, blocked: false });
      return { allowed: true };
    }

    // Increment attempts
    record.count++;

    if (record.count > maxAttempts) {
      // Block with exponential backoff
      const blockTime = blockDurationMs * Math.pow(2, Math.min(record.count - maxAttempts - 1, 5));
      record.blocked = true;
      record.blockUntil = now + blockTime;
      return { allowed: false, retryAfter: Math.ceil(blockTime / 1000) };
    }

    return { allowed: true };
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

/**
 * Brute Force Protection
 */
export class BruteForceProtection {
  private failedAttempts: Map<string, number> = new Map();
  private lockouts: Map<string, number> = new Map();

  recordFailedAttempt(username: string): void {
    const attempts = (this.failedAttempts.get(username) || 0) + 1;
    this.failedAttempts.set(username, attempts);

    // Lock after 5 failed attempts
    if (attempts >= 5) {
      const lockUntil = Date.now() + (attempts - 4) * 60000; // 1 min, 2 min, 3 min, etc.
      this.lockouts.set(username, lockUntil);
    }
  }

  isLocked(username: string): { locked: boolean; retryAfter?: number } {
    const lockUntil = this.lockouts.get(username);
    if (!lockUntil) return { locked: false };

    if (Date.now() < lockUntil) {
      return { locked: true, retryAfter: Math.ceil((lockUntil - Date.now()) / 1000) };
    }

    // Unlock
    this.lockouts.delete(username);
    this.failedAttempts.delete(username);
    return { locked: false };
  }

  recordSuccess(username: string): void {
    this.failedAttempts.delete(username);
    this.lockouts.delete(username);
  }
}

// ============================================
// ADVANCED PERFORMANCE
// ============================================

/**
 * Optimized Debounce with leading edge option
 */
export function advancedDebounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = { trailing: true }
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  let lastArgs: Parameters<T> | null = null;

  return function(this: any, ...args: Parameters<T>) {
    const context = this;
    const later = () => {
      timeout = null;
      if (options.trailing && lastArgs) {
        func.apply(context, lastArgs);
      }
    };

    const callNow = options.leading && !timeout;

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    lastArgs = args;

    if (callNow) {
      func.apply(context, args);
    }
  };
}

/**
 * Request Animation Frame Throttle for smooth 60fps
 */
export function rafThrottle<T extends (...args: any[]) => any>(callback: T): (...args: Parameters<T>) => void {
  let requestId: number | null = null;
  let lastArgs: Parameters<T> | null = null;

  return function(this: any, ...args: Parameters<T>) {
    lastArgs = args;

    if (requestId === null) {
      requestId = requestAnimationFrame(() => {
        if (lastArgs) {
          callback.apply(this, lastArgs);
          lastArgs = null;
        }
        requestId = null;
      });
    }
  };
}

/**
 * Intelligent Cache with TTL and memory limits
 */
export class SmartCache<K, V> {
  private cache: Map<K, { value: V; timestamp: number; hits: number }> = new Map();
  private maxSize: number;
  private ttl: number;

  constructor(maxSize: number = 1000, ttl: number = 300000) {
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    // Check if expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return undefined;
    }

    // Update hits
    entry.hits++;
    return entry.value;
  }

  set(key: K, value: V): void {
    // Evict old entries if at max size
    if (this.cache.size >= this.maxSize) {
      this.evictLeastUsed();
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      hits: 0
    });
  }

  private evictLeastUsed(): void {
    let minHits = Infinity;
    let keyToEvict: K | null = null;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.hits < minHits) {
        minHits = entry.hits;
        keyToEvict = key;
      }
    }

    if (keyToEvict !== null) {
      this.cache.delete(keyToEvict);
    }
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

/**
 * Virtual Scroll Manager for large lists
 */
export class VirtualScrollManager {
  private itemHeight: number;
  private containerHeight: number;
  private buffer: number;

  constructor(itemHeight: number, containerHeight: number, buffer: number = 5) {
    this.itemHeight = itemHeight;
    this.containerHeight = containerHeight;
    this.buffer = buffer;
  }

  getVisibleRange(scrollTop: number, totalItems: number): { start: number; end: number } {
    const start = Math.max(0, Math.floor(scrollTop / this.itemHeight) - this.buffer);
    const visibleCount = Math.ceil(this.containerHeight / this.itemHeight);
    const end = Math.min(totalItems, start + visibleCount + this.buffer * 2);

    return { start, end };
  }

  getTotalHeight(totalItems: number): number {
    return totalItems * this.itemHeight;
  }

  getOffsetY(startIndex: number): number {
    return startIndex * this.itemHeight;
  }
}

/**
 * Batch Processor for heavy operations
 */
export class BatchProcessor<T> {
  private queue: T[] = [];
  private processing: boolean = false;
  private batchSize: number;
  private processFn: (batch: T[]) => Promise<void>;

  constructor(batchSize: number, processFn: (batch: T[]) => Promise<void>) {
    this.batchSize = batchSize;
    this.processFn = processFn;
  }

  add(item: T): void {
    this.queue.push(item);
    this.processQueue();
  }

  addBatch(items: T[]): void {
    this.queue.push(...items);
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;

    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, Math.min(this.batchSize, this.queue.length));
      await this.processFn(batch);
    }

    this.processing = false;
  }
}

/**
 * Image Lazy Loader with IntersectionObserver
 */
export class LazyImageLoader {
  private observer: IntersectionObserver;

  constructor(options?: IntersectionObserverInit) {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            this.observer.unobserve(img);
          }
        }
      });
    }, options);
  }

  observe(element: HTMLImageElement): void {
    this.observer.observe(element);
  }

  disconnect(): void {
    this.observer.disconnect();
  }
}

/**
 * Memory Monitor to prevent leaks
 */
export class MemoryMonitor {
  checkMemoryUsage(): { used: number; limit: number; percentage: number } | null {
    if ('memory' in performance && (performance as any).memory) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
      };
    }
    return null;
  }

  isMemoryHigh(threshold: number = 80): boolean {
    const usage = this.checkMemoryUsage();
    return usage ? usage.percentage > threshold : false;
  }
}

/**
 * Network Speed Detector
 */
export async function detectNetworkSpeed(): Promise<'slow' | 'medium' | 'fast'> {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    if (connection) {
      const effectiveType = connection.effectiveType;
      if (effectiveType === '4g') return 'fast';
      if (effectiveType === '3g') return 'medium';
      return 'slow';
    }
  }

  // Fallback: measure ping
  const start = Date.now();
  try {
    await fetch('/api/ping', { method: 'HEAD' });
    const ping = Date.now() - start;
    if (ping < 100) return 'fast';
    if (ping < 300) return 'medium';
    return 'slow';
  } catch {
    return 'medium';
  }
}

// Export all utilities
export const SecurityUtils = {
  advancedSanitize,
  preventSQLInjection,
  generateSecureToken,
  AdvancedRateLimiter,
  BruteForceProtection
};

export const PerformanceUtils = {
  advancedDebounce,
  rafThrottle,
  SmartCache,
  VirtualScrollManager,
  BatchProcessor,
  LazyImageLoader,
  MemoryMonitor,
  detectNetworkSpeed
};
