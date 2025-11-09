/**
 * Performance Optimization Utilities for PokerMind
 * Provides fast, secure, and fluid gaming experience
 */

// Debounce function for performance optimization
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for rate limiting
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Memoization for expensive computations
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// FPS Monitor for performance tracking
export class FPSMonitor {
  private frames: number[] = [];
  private lastTime = performance.now();

  tick() {
    const now = performance.now();
    const delta = now - this.lastTime;
    this.lastTime = now;

    this.frames.push(1000 / delta);
    if (this.frames.length > 60) {
      this.frames.shift();
    }
  }

  getFPS(): number {
    if (this.frames.length === 0) return 0;
    const sum = this.frames.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.frames.length);
  }

  reset() {
    this.frames = [];
    this.lastTime = performance.now();
  }
}

// Network latency monitor
export class LatencyMonitor {
  private latencies: number[] = [];

  addLatency(latency: number) {
    this.latencies.push(latency);
    if (this.latencies.length > 20) {
      this.latencies.shift();
    }
  }

  getAverageLatency(): number {
    if (this.latencies.length === 0) return 0;
    const sum = this.latencies.reduce((a, b) => a + b, 0);
    return Math.round(sum / this.latencies.length);
  }

  getStatus(): 'excellent' | 'good' | 'fair' | 'poor' {
    const avg = this.getAverageLatency();
    if (avg < 50) return 'excellent';
    if (avg < 100) return 'good';
    if (avg < 200) return 'fair';
    return 'poor';
  }
}

// Image lazy loading with intersection observer
export function lazyLoadImage(imgElement: HTMLImageElement, src: string) {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          imgElement.src = src;
          observer.unobserve(imgElement);
        }
      });
    });

    observer.observe(imgElement);
  } else {
    // Fallback for browsers without IntersectionObserver
    imgElement.src = src;
  }
}

// Preload critical resources
export function preloadResources(urls: string[]) {
  urls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';

    if (url.endsWith('.js')) {
      link.as = 'script';
    } else if (url.endsWith('.css')) {
      link.as = 'style';
    } else if (url.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i)) {
      link.as = 'image';
    }

    link.href = url;
    document.head.appendChild(link);
  });
}

// Virtual scrolling for large lists
export function calculateVisibleRange(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan = 3
): { start: number; end: number } {
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const end = Math.min(totalItems, start + visibleCount + overscan * 2);

  return { start, end };
}

// Request Animation Frame with fallback
export const requestAnimFrame = (() => {
  return (
    window.requestAnimationFrame ||
    function (callback: FrameRequestCallback) {
      return window.setTimeout(callback, 1000 / 60);
    }
  );
})();

// Cancel Animation Frame with fallback
export const cancelAnimFrame = (() => {
  return (
    window.cancelAnimationFrame ||
    function (id: number) {
      clearTimeout(id);
    }
  );
})();

// Web Worker pool for heavy computations
export class WorkerPool {
  private workers: Worker[] = [];
  private taskQueue: Array<{
    data: any;
    resolve: (value: any) => void;
    reject: (reason: any) => void;
  }> = [];
  private activeWorkers = 0;

  constructor(workerScript: string, poolSize = navigator.hardwareConcurrency || 4) {
    for (let i = 0; i < poolSize; i++) {
      const worker = new Worker(workerScript);
      worker.onmessage = (e) => this.handleWorkerMessage(e, worker);
      worker.onerror = (e) => this.handleWorkerError(e);
      this.workers.push(worker);
    }
  }

  async execute(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.taskQueue.push({ data, resolve, reject });
      this.processQueue();
    });
  }

  private processQueue() {
    if (this.taskQueue.length === 0 || this.activeWorkers >= this.workers.length) {
      return;
    }

    const task = this.taskQueue.shift()!;
    const worker = this.workers[this.activeWorkers];
    this.activeWorkers++;

    worker.postMessage(task.data);
    (worker as any)._currentTask = task;
  }

  private handleWorkerMessage(e: MessageEvent, worker: Worker) {
    const task = (worker as any)._currentTask;
    if (task) {
      task.resolve(e.data);
      delete (worker as any)._currentTask;
    }

    this.activeWorkers--;
    this.processQueue();
  }

  private handleWorkerError(e: ErrorEvent) {
    console.error('Worker error:', e);
    this.activeWorkers--;
    this.processQueue();
  }

  terminate() {
    this.workers.forEach((worker) => worker.terminate());
    this.workers = [];
  }
}

// Service Worker registration for PWA caching
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
}

// IndexedDB wrapper for offline storage
export class OfflineStorage {
  private db: IDBDatabase | null = null;
  private dbName = 'pokermind-offline';
  private version = 1;

  async init() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('gameState')) {
          db.createObjectStore('gameState', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('userPreferences')) {
          db.createObjectStore('userPreferences', { keyPath: 'key' });
        }
      };
    });
  }

  async set(storeName: string, key: string, value: any) {
    if (!this.db) await this.init();

    return new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put({ id: key, data: value });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async get(storeName: string, key: string) {
    if (!this.db) await this.init();

    return new Promise<any>((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result?.data);
      request.onerror = () => reject(request.error);
    });
  }
}

// Performance metrics collector
export class PerformanceMetrics {
  private metrics: Map<string, number[]> = new Map();

  record(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  getAverage(name: string): number {
    const values = this.metrics.get(name) || [];
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  getP95(name: string): number {
    const values = this.metrics.get(name) || [];
    if (values.length === 0) return 0;

    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.floor(sorted.length * 0.95);
    return sorted[index];
  }

  reset() {
    this.metrics.clear();
  }
}
