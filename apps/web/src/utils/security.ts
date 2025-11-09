/**
 * Security Utilities for PokerMind
 * Provides encryption, validation, and protection against common attacks
 */

// Input sanitization to prevent XSS
export function sanitizeInput(input: string): string {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Password strength checker
export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string;
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
} {
  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) score++;
  else feedback.push('Au moins 8 caractères');

  if (password.length >= 12) score++;

  if (/[a-z]/.test(password)) score++;
  else feedback.push('Au moins une minuscule');

  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Au moins une majuscule');

  if (/[0-9]/.test(password)) score++;
  else feedback.push('Au moins un chiffre');

  if (/[^A-Za-z0-9]/.test(password)) score++;
  else feedback.push('Au moins un caractère spécial');

  let strength: 'weak' | 'medium' | 'strong' | 'very-strong' = 'weak';
  if (score >= 5) strength = 'very-strong';
  else if (score >= 4) strength = 'strong';
  else if (score >= 3) strength = 'medium';

  return {
    score,
    feedback: feedback.join(', '),
    strength,
  };
}

// CSRF token generation
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

// Rate limiting class
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  isAllowed(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];

    // Remove old attempts outside the window
    const recentAttempts = attempts.filter((time) => now - time < windowMs);

    if (recentAttempts.length >= maxAttempts) {
      return false;
    }

    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }

  reset(key: string) {
    this.attempts.delete(key);
  }
}

// Content Security Policy helper
export function generateCSPHeader(): string {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.stripe.com wss:",
    "frame-src https://js.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join('; ');
}

// Secure random number generator
export function secureRandomInt(min: number, max: number): number {
  const range = max - min;
  const bytesNeeded = Math.ceil(Math.log2(range) / 8);
  const randomBytes = new Uint8Array(bytesNeeded);
  crypto.getRandomValues(randomBytes);

  let randomNum = 0;
  for (let i = 0; i < bytesNeeded; i++) {
    randomNum = (randomNum << 8) + randomBytes[i];
  }

  return min + (randomNum % range);
}

// Hash function (SHA-256) for client-side hashing
export async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Encrypt data for local storage (simple XOR cipher - for demo, use proper encryption in production)
export function encryptData(data: string, key: string): string {
  let result = '';
  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return btoa(result);
}

// Decrypt data from local storage
export function decryptData(encrypted: string, key: string): string {
  const data = atob(encrypted);
  let result = '';
  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
}

// SQL injection prevention (for user inputs that might be used in queries)
export function escapeSQLInput(input: string): string {
  return input.replace(/['";\\]/g, (char) => '\\' + char);
}

// Validate game action to prevent cheating
export function validateGameAction(
  action: any,
  gameState: any,
  playerId: string
): { valid: boolean; reason?: string } {
  // Check if it's the player's turn
  if (gameState.activePlayer !== playerId) {
    return { valid: false, reason: "Ce n'est pas votre tour" };
  }

  // Check if action is valid
  const validActions = ['fold', 'check', 'call', 'raise', 'bet', 'all-in'];
  if (!validActions.includes(action.type)) {
    return { valid: false, reason: 'Action invalide' };
  }

  // Check bet amounts
  if (['raise', 'bet'].includes(action.type)) {
    if (action.amount < gameState.minBet) {
      return { valid: false, reason: 'Mise trop faible' };
    }
    if (action.amount > gameState.playerStack) {
      return { valid: false, reason: 'Stack insuffisant' };
    }
  }

  return { valid: true };
}

// Anti-bot detection
export class AntiBotDetection {
  private mouseMovements: number = 0;
  private keyPresses: number = 0;
  private startTime: number = Date.now();

  trackMouseMovement() {
    this.mouseMovements++;
  }

  trackKeyPress() {
    this.keyPresses++;
  }

  isProbablyHuman(): boolean {
    const elapsed = (Date.now() - this.startTime) / 1000; // seconds
    const movementsPerSecond = this.mouseMovements / elapsed;
    const keyPressesPerSecond = this.keyPresses / elapsed;

    // Bots typically have very consistent or no mouse movements
    return (
      movementsPerSecond > 0.1 && movementsPerSecond < 50 && keyPressesPerSecond < 20
    );
  }

  reset() {
    this.mouseMovements = 0;
    this.keyPresses = 0;
    this.startTime = Date.now();
  }
}

// Session timeout manager
export class SessionManager {
  private lastActivity: number = Date.now();
  private timeoutDuration: number = 30 * 60 * 1000; // 30 minutes
  private warningDuration: number = 5 * 60 * 1000; // 5 minutes before timeout
  private onTimeout?: () => void;
  private onWarning?: () => void;
  private checkInterval?: NodeJS.Timeout;

  constructor(onTimeout?: () => void, onWarning?: () => void) {
    this.onTimeout = onTimeout;
    this.onWarning = onWarning;
    this.startMonitoring();
  }

  updateActivity() {
    this.lastActivity = Date.now();
  }

  private startMonitoring() {
    this.checkInterval = setInterval(() => {
      const elapsed = Date.now() - this.lastActivity;

      if (elapsed >= this.timeoutDuration) {
        this.onTimeout?.();
        this.stopMonitoring();
      } else if (elapsed >= this.timeoutDuration - this.warningDuration) {
        this.onWarning?.();
      }
    }, 1000);
  }

  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }

  getRemainingTime(): number {
    const elapsed = Date.now() - this.lastActivity;
    return Math.max(0, this.timeoutDuration - elapsed);
  }
}

// IP address obfuscation (for privacy)
export function obfuscateIP(ip: string): string {
  const parts = ip.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.XXX.XXX`;
  }
  return 'XXX.XXX.XXX.XXX';
}

// Secure WebSocket connection helper
export function createSecureWebSocket(url: string, protocols?: string | string[]): WebSocket {
  // Ensure WSS protocol in production
  const secureUrl = url.replace(/^ws:/, 'wss:');

  const ws = new WebSocket(secureUrl, protocols);

  // Add security event listeners
  ws.addEventListener('error', (event) => {
    console.error('WebSocket security error:', event);
  });

  ws.addEventListener('close', (event) => {
    if (!event.wasClean) {
      console.warn('WebSocket closed unexpectedly:', event.code, event.reason);
    }
  });

  return ws;
}

// Data integrity checker (simple checksum)
export function calculateChecksum(data: any): string {
  const str = JSON.stringify(data);
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return hash.toString(16);
}

// Verify data integrity
export function verifyDataIntegrity(data: any, checksum: string): boolean {
  return calculateChecksum(data) === checksum;
}

// Secure cookie settings helper
export function setSecureCookie(name: string, value: string, days: number = 7) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  const cookieOptions = [
    `${name}=${encodeURIComponent(value)}`,
    `expires=${expires.toUTCString()}`,
    'path=/',
    'SameSite=Strict',
    'Secure', // Only over HTTPS
  ];

  document.cookie = cookieOptions.join('; ');
}

// Get secure cookie
export function getSecureCookie(name: string): string | null {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }

  return null;
}

// Delete secure cookie
export function deleteSecureCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict; Secure`;
}
