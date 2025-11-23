# 📱 POKERMIND - MOBILE DESIGN SYSTEM

## 🎨 DESIGN PHILOSOPHY

**Principes:**
- **Mobile-First** - Optimisé pour écrans 5-7 pouces
- **Thumb-Friendly** - Tous les contrôles accessibles d'une main
- **Clarity** - Information hiérarchisée, lisible sans effort
- **Speed** - Chargement < 2s, interactions instantanées
- **Beauty** - Design moderne, animations fluides 60 FPS

---

## 🎨 COLOR PALETTE

### Primary Colors
```css
--poker-primary: #8B5CF6      /* Purple - Main brand */
--poker-secondary: #EC4899    /* Pink - Accents */
--poker-accent: #FBBF24       /* Gold - VIP/Premium */
--poker-success: #22C55E      /* Green - Wins/Positive */
--poker-danger: #EF4444       /* Red - Losses/Danger */
--poker-info: #3B82F6         /* Blue - Information */
```

### Neutral Colors
```css
--gray-900: #0F172A          /* Background dark */
--gray-800: #1E293B          /* Cards background */
--gray-700: #334155          /* Borders */
--gray-600: #475569          /* Disabled */
--gray-400: #94A3B8          /* Placeholder */
--gray-300: #CBD5E1          /* Borders light */
--gray-100: #F1F5F9          /* Background light */
--white: #FFFFFF             /* Text on dark */
```

### Game-Specific Colors
```css
--table-green: #1E7A1E       /* Table felt */
--chip-red: #DC2626          /* $5 chips */
--chip-blue: #2563EB         /* $10 chips */
--chip-green: #16A34A        /* $25 chips */
--chip-black: #171717        /* $100 chips */
--chip-purple: #9333EA       /* $500 chips */
--chip-gold: #D4AF37         /* $1000 chips */
```

---

## 📏 SPACING SYSTEM

```css
--space-1: 4px    /* Tight spacing */
--space-2: 8px    /* Small spacing */
--space-3: 12px   /* Base spacing */
--space-4: 16px   /* Medium spacing */
--space-5: 20px   /* Large spacing */
--space-6: 24px   /* XL spacing */
--space-8: 32px   /* XXL spacing */
--space-10: 40px  /* XXXL spacing */
```

---

## 🔤 TYPOGRAPHY

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
             'Helvetica Neue', Arial, sans-serif;
```

### Font Sizes (Mobile-Optimized)
```css
--text-xs: 11px      /* Small labels */
--text-sm: 13px      /* Secondary text */
--text-base: 15px    /* Body text */
--text-lg: 17px      /* Emphasized text */
--text-xl: 20px      /* Headings */
--text-2xl: 24px     /* Page titles */
--text-3xl: 30px     /* Hero text */
--text-4xl: 36px     /* Display text */
```

### Font Weights
```css
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
--font-extrabold: 800
```

---

## 🎯 TOUCH TARGETS

**Minimum Touch Target Size: 44x44px** (Apple HIG)

```css
/* Buttons */
.btn-primary {
  min-height: 48px;
  padding: 12px 24px;
  border-radius: 12px;
}

/* Small buttons */
.btn-small {
  min-height: 36px;
  padding: 8px 16px;
  border-radius: 8px;
}

/* Icon buttons */
.btn-icon {
  min-width: 44px;
  min-height: 44px;
  border-radius: 50%;
}
```

---

## 📱 MOBILE SCREENS WIREFRAMES

### 1. SPLASH SCREEN (Onboarding)
```
┌─────────────────────────┐
│                         │
│         🎰              │
│     POKERMIND          │
│                         │
│   The Future of        │
│   Online Poker         │
│                         │
│   [━━━━━━━━━━] 60%     │ Loading bar
│                         │
└─────────────────────────┘
```

### 2. LOGIN / REGISTER SCREEN
```
┌─────────────────────────┐
│  [←]         POKERMIND  │ Header
├─────────────────────────┤
│                         │
│   Welcome Back! 👋      │
│                         │
│   ┌─────────────────┐   │
│   │ 📧 Email        │   │ Input
│   └─────────────────┘   │
│                         │
│   ┌─────────────────┐   │
│   │ 🔒 Password     │   │ Input
│   └─────────────────┘   │
│                         │
│   [Forgot Password?]    │ Link
│                         │
│   ┌─────────────────┐   │
│   │   🚀 LOGIN      │   │ Primary button
│   └─────────────────┘   │
│                         │
│   ─── OR LOGIN WITH ─── │
│                         │
│   [🔗] [🎮] [📱]       │ Wallet/Social
│                         │
│   Don't have account?   │
│   [Sign Up]             │ Link
│                         │
└─────────────────────────┘
```

### 3. HOME DASHBOARD
```
┌─────────────────────────┐
│  ☰  POKERMIND    [🔔3]  │ Header
├─────────────────────────┤
│                         │
│  Hey, Player! 🎰        │ Greeting
│  Level 12 • 2,450 XP    │ Progress
│  [━━━━━━━━──] 82%       │ XP Bar
│                         │
│  💰 Balance: $12,450    │ Balance card
│  📊 Win Rate: 65.3%     │ Stats
│                         │
│  ┌─────────────────┐    │
│  │ 🎮 Quick Play  │    │ Large CTA
│  └─────────────────┘    │
│                         │
│  Game Modes             │ Section
│  ┌────┐ ┌────┐ ┌────┐  │
│  │💰  │ │🏆  │ │⚡  │  │ Mode cards
│  │Cash│ │Tour│ │S&G │  │
│  └────┘ └────┘ └────┘  │
│                         │
│  Active Tables 🔥       │ Section
│  ┌─────────────────┐    │
│  │ NL50 • 6/9 👥   │    │ Table card
│  │ Pot: $125       │    │
│  │ [JOIN →]        │    │
│  └─────────────────┘    │
│                         │
│  Daily Challenges ⭐    │ Section
│  [View All →]           │
│                         │
├─────────────────────────┤
│ [🏠] [🎮] [📊] [👤]    │ Bottom Nav
└─────────────────────────┘
```

### 4. TABLE LOBBY
```
┌─────────────────────────┐
│  [←]  Cash Games  [⚙️]  │ Header
├─────────────────────────┤
│                         │
│  [All▼] [NL▼] [$▼]     │ Filters
│                         │
│  ┌─────────────────┐    │
│  │ 🎰 NL50         │    │ Table card
│  │                 │    │
│  │ 👥 6/9 Players  │    │
│  │ 💰 Avg Pot: $45 │    │
│  │ ⚡ 75 hands/hr  │    │
│  │                 │    │
│  │ Stakes: $0.25/$0.50│ │
│  │                 │    │
│  │ [JOIN TABLE →]  │    │ CTA
│  └─────────────────┘    │
│                         │
│  ┌─────────────────┐    │
│  │ 🎰 NL100        │    │ Table card
│  │ 👥 8/9 Players  │    │
│  │ 💰 Avg Pot: $85 │    │
│  │ ⚡ 62 hands/hr  │    │
│  │ Stakes: $0.50/$1│    │
│  │ [JOIN TABLE →]  │    │
│  └─────────────────┘    │
│                         │
│  ⋮                      │ More tables
│                         │
└─────────────────────────┘
```

### 5. POKER TABLE (GAME VIEW)
```
┌─────────────────────────┐
│  [←] NL50  $125  [⚙️]   │ Header
├─────────────────────────┤
│                         │
│     👤    👤    👤      │ Opponents
│   $500  $320  $780      │ Stacks
│                         │
│   ┌─────────────┐       │
│   │             │       │ Table felt
│   │  🃏 🃏 🃏   │       │ Community
│   │  💰 $125    │       │ Pot
│   │             │       │
│   └─────────────┘       │
│                         │
│     👤         👤       │ Side players
│   $450       $620       │
│                         │
│        🃏🃏             │ Your cards
│      A♠️ K♠️            │
│                         │
│  ⏱️ 15s  [━━━━━━──]    │ Action timer
│                         │
│  ┌──────┐ ┌──────┐     │
│  │ FOLD │ │ CALL │     │ Actions
│  └──────┘ └──────┘     │
│  ┌──────────────┐      │
│  │ RAISE $50 ▲▼│      │ Raise slider
│  └──────────────┘      │
│                         │
└─────────────────────────┘
```

### 6. RAISE AMOUNT SELECTOR
```
┌─────────────────────────┐
│                         │
│  Select Raise Amount    │ Title
│                         │
│  Pot: $125              │ Info
│  Min: $25  Max: $500    │
│                         │
│  ┌─────────────────┐    │
│  │      $50        │    │ Amount display
│  └─────────────────┘    │
│                         │
│  [━━━━━●━━━━━━━━━]      │ Slider
│                         │
│  [$25] [Pot] [All-In]   │ Quick amounts
│                         │
│  [1][2][3]              │ Number pad
│  [4][5][6]              │
│  [7][8][9]              │
│  [.][0][⌫]             │
│                         │
│  ┌─────────────────┐    │
│  │ 🚀 RAISE $50    │    │ Confirm
│  └─────────────────┘    │
│                         │
└─────────────────────────┘
```

### 7. NFT MARKETPLACE
```
┌─────────────────────────┐
│  [←]  Marketplace  [🔍] │ Header
├─────────────────────────┤
│                         │
│  🔥 Featured            │ Section
│  ┌─────────────────┐    │
│  │     👑          │    │ Featured NFT
│  │  Royal Flush    │    │
│  │  Golden Card    │    │
│  │                 │    │
│  │  Ξ 5.5 ETH      │    │ Price
│  │  [BUY NOW]      │    │ CTA
│  └─────────────────┘    │
│                         │
│  [All▼] [Rarity▼] [$▼] │ Filters
│                         │
│  ┌────┐ ┌────┐ ┌────┐  │
│  │👑  │ │🤖  │ │🌌  │  │ NFT grid
│  │5.5Ξ│ │2.8Ξ│ │1.2Ξ│  │
│  └────┘ └────┘ └────┘  │
│                         │
│  ┌────┐ ┌────┐ ┌────┐  │
│  │🔥  │ │❄️  │ │💎  │  │
│  │3.0Ξ│ │1.5Ξ│ │0.8Ξ│  │
│  └────┘ └────┘ └────┘  │
│                         │
└─────────────────────────┘
```

### 8. WALLET
```
┌─────────────────────────┐
│  [←]     Wallet         │ Header
├─────────────────────────┤
│                         │
│  💎 My Wallet           │ Title
│  0x1234...5678          │ Address
│  [📋 Copy]              │
│                         │
│  Balances               │ Section
│  ┌─────────────────┐    │
│  │ Ξ ETH           │    │
│  │ 2.5432          │    │ Balance
│  │ ≈ $4,125        │    │ USD value
│  └─────────────────┘    │
│                         │
│  ┌─────────────────┐    │
│  │ 🎰 POKER        │    │
│  │ 50,000          │    │
│  │ ≈ $1,250        │    │
│  └─────────────────┘    │
│                         │
│  ┌─────────────────┐    │
│  │ 💵 USDC         │    │
│  │ 5,420           │    │
│  │ ≈ $5,420        │    │
│  └─────────────────┘    │
│                         │
│  ┌──────┐ ┌──────┐     │
│  │DEPOSIT│ │WITHDRAW│   │ Actions
│  └──────┘ └──────┘     │
│                         │
│  Recent Transactions    │
│  [View All →]           │
│                         │
└─────────────────────────┘
```

### 9. AI TRAINING
```
┌─────────────────────────┐
│  [←]  AI Training  [ℹ️]  │ Header
├─────────────────────────┤
│                         │
│  🤖 Your Progress       │
│  Level 8 • Rating: 1,245│
│  [━━━━━━━━──] 82%       │ Progress
│                         │
│  Training Levels        │ Section
│                         │
│  ┌─────────────────┐    │
│  │ 📚 Level 1      │    │ Unlocked
│  │ Poker Basics    │    │
│  │ ⭐⭐⭐           │    │ Stars
│  │ [✓ COMPLETED]   │    │
│  └─────────────────┘    │
│                         │
│  ┌─────────────────┐    │
│  │ 🎯 Level 2      │    │ Current
│  │ Position & Odds │    │
│  │ ☆☆☆             │    │
│  │ [▶ START]       │    │ CTA
│  └─────────────────┘    │
│                         │
│  ┌─────────────────┐    │
│  │ 🎭 Level 3      │    │ Locked
│  │ Bluff & Semi    │    │
│  │ 🔒 Rating 600+  │    │ Requirement
│  └─────────────────┘    │
│                         │
└─────────────────────────┘
```

### 10. PROFILE
```
┌─────────────────────────┐
│  [←]    Profile   [⚙️]  │ Header
├─────────────────────────┤
│                         │
│       🎰 👤            │ Avatar
│     PlayerPro          │ Username
│   Level 12 • VIP 💎    │ Status
│                         │
│  ┌──────────────────┐   │
│  │ 📊 Stats         │   │ Section
│  │                  │   │
│  │ Hands: 12,847    │   │
│  │ Win Rate: 65.3%  │   │
│  │ Profit: +$45,632 │   │
│  │ Rating: 1,245    │   │
│  └──────────────────┘   │
│                         │
│  ┌──────────────────┐   │
│  │ 🏆 Achievements  │   │
│  │ 42/50            │   │
│  │ [View All →]     │   │
│  └──────────────────┘   │
│                         │
│  ┌──────────────────┐   │
│  │ 💎 My NFTs       │   │
│  │ 15 items         │   │
│  │ [View All →]     │   │
│  └──────────────────┘   │
│                         │
│  Options                │
│  [🔔 Notifications]     │
│  [🎨 Customize]         │
│  [📚 Help & Support]    │
│  [🚪 Logout]            │
│                         │
└─────────────────────────┘
```

---

## 🎨 COMPONENT LIBRARY

### Buttons

```tsx
// Primary Button
<button className="
  w-full h-12
  bg-gradient-to-r from-purple-600 to-pink-600
  hover:from-purple-700 hover:to-pink-700
  active:scale-95
  text-white font-bold text-base
  rounded-xl
  shadow-lg shadow-purple-500/50
  transition-all duration-200
">
  Continue
</button>

// Secondary Button
<button className="
  w-full h-12
  bg-gray-800 hover:bg-gray-700
  active:scale-95
  text-white font-semibold text-base
  rounded-xl border-2 border-gray-600
  transition-all duration-200
">
  Cancel
</button>

// Outlined Button
<button className="
  w-full h-12
  bg-transparent border-2 border-purple-500
  hover:bg-purple-500/10
  active:scale-95
  text-purple-500 font-semibold text-base
  rounded-xl
  transition-all duration-200
">
  Learn More
</button>

// Icon Button
<button className="
  w-11 h-11
  bg-gray-800 hover:bg-gray-700
  active:scale-95
  rounded-full
  flex items-center justify-center
  transition-all duration-200
">
  <Icon />
</button>
```

### Cards

```tsx
// Game Card
<div className="
  bg-gradient-to-br from-gray-800 to-gray-900
  rounded-2xl p-4
  border-2 border-gray-700
  shadow-xl
">
  <div className="flex justify-between items-start mb-3">
    <div>
      <h3 className="text-white font-bold text-lg">NL50</h3>
      <p className="text-gray-400 text-sm">$0.25/$0.50</p>
    </div>
    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
      LIVE
    </span>
  </div>

  <div className="space-y-2 mb-4">
    <div className="flex items-center gap-2 text-gray-300 text-sm">
      <span>👥</span>
      <span>6/9 Players</span>
    </div>
    <div className="flex items-center gap-2 text-gray-300 text-sm">
      <span>💰</span>
      <span>Avg Pot: $45</span>
    </div>
  </div>

  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg">
    JOIN TABLE
  </button>
</div>

// NFT Card
<div className="
  bg-gradient-to-br from-purple-600 to-pink-600
  rounded-2xl p-1
  shadow-2xl
">
  <div className="bg-gray-900 rounded-xl overflow-hidden">
    <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
      <span className="text-8xl">👑</span>
    </div>
    <div className="p-4">
      <h3 className="text-white font-bold text-lg mb-1">Royal Flush</h3>
      <span className="inline-block px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full">
        LEGENDARY
      </span>
      <div className="mt-3 text-white text-2xl font-bold">
        Ξ 5.5
      </div>
    </div>
  </div>
</div>
```

### Inputs

```tsx
// Text Input
<div className="relative">
  <input
    type="text"
    placeholder="Email"
    className="
      w-full h-12 px-4
      bg-gray-800
      border-2 border-gray-700
      focus:border-purple-500
      rounded-xl
      text-white placeholder-gray-400
      transition-colors duration-200
      outline-none
    "
  />
  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
    📧
  </span>
</div>

// Slider
<input
  type="range"
  min="0"
  max="100"
  className="
    w-full h-2
    bg-gray-700
    rounded-full
    appearance-none
    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:w-6
    [&::-webkit-slider-thumb]:h-6
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:bg-purple-600
    [&::-webkit-slider-thumb]:cursor-pointer
  "
/>
```

### Bottom Navigation

```tsx
<nav className="
  fixed bottom-0 left-0 right-0
  bg-gray-900 border-t-2 border-gray-800
  h-16
  flex items-center justify-around
  safe-area-bottom
">
  <button className="flex flex-col items-center gap-1">
    <span className="text-2xl">🏠</span>
    <span className="text-purple-500 text-xs font-medium">Home</span>
  </button>

  <button className="flex flex-col items-center gap-1">
    <span className="text-2xl">🎮</span>
    <span className="text-gray-400 text-xs font-medium">Play</span>
  </button>

  <button className="flex flex-col items-center gap-1">
    <span className="text-2xl">📊</span>
    <span className="text-gray-400 text-xs font-medium">Stats</span>
  </button>

  <button className="flex flex-col items-center gap-1">
    <span className="text-2xl">👤</span>
    <span className="text-gray-400 text-xs font-medium">Profile</span>
  </button>
</nav>
```

---

## 🎭 ANIMATIONS

### Micro-interactions

```css
/* Button press */
@keyframes press {
  0% { transform: scale(1); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}

/* Card reveal */
@keyframes cardFlip {
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(180deg); }
}

/* Chip toss */
@keyframes chipToss {
  0% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(50px, -100px) rotate(180deg); }
  100% { transform: translate(100px, 0) rotate(360deg); }
}

/* Win celebration */
@keyframes celebrate {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.1) rotate(-5deg); }
  75% { transform: scale(1.1) rotate(5deg); }
}
```

### Page Transitions

```tsx
// Framer Motion variants
const pageVariants = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 }
}

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.3
}

<motion.div
  variants={pageVariants}
  initial="initial"
  animate="animate"
  exit="exit"
  transition={pageTransition}
>
  {/* Page content */}
</motion.div>
```

---

## 📱 RESPONSIVE BREAKPOINTS

```css
/* Mobile First */
@media (min-width: 375px) { /* Small phones */ }
@media (min-width: 414px) { /* Large phones */ }
@media (min-width: 768px) { /* Tablets */ }
@media (min-width: 1024px) { /* Desktop */ }
```

---

## 🎨 DARK MODE SUPPORT

```css
/* Always dark for poker feel */
:root {
  color-scheme: dark;
  --background: #0F172A;
  --foreground: #FFFFFF;
}

/* But support system preference */
@media (prefers-color-scheme: light) {
  /* Adjust slightly for day use */
  :root {
    --background: #1E293B;
  }
}
```

---

## ♿ ACCESSIBILITY

```tsx
// Screen reader support
<button aria-label="Fold hand">
  Fold
</button>

// Focus visible
.focus-visible:focus {
  outline: 2px solid #8B5CF6;
  outline-offset: 2px;
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🎮 GAME-SPECIFIC UI

### Card Display

```tsx
<div className="
  relative w-16 h-24
  bg-white rounded-lg
  shadow-xl
  flex flex-col items-center justify-center
">
  <span className="text-3xl text-black">A</span>
  <span className="text-2xl text-red-600">♠️</span>
</div>
```

### Chip Stack

```tsx
<div className="flex flex-col items-center">
  {[5, 4, 3, 2, 1].map((chip, i) => (
    <div
      key={i}
      className="
        w-12 h-3
        rounded-full
        bg-gradient-to-b from-red-500 to-red-700
        border-2 border-white
        shadow-lg
      "
      style={{ marginTop: i === 0 ? 0 : -8 }}
    />
  ))}
</div>
```

### Action Timer

```tsx
<div className="relative">
  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
    <div
      className="h-full bg-gradient-to-r from-green-500 to-yellow-500 to-red-500 animate-[shrink_15s_linear]"
      style={{ width: `${timePercent}%` }}
    />
  </div>
  <span className="absolute -top-6 right-0 text-white font-bold">
    {timeLeft}s
  </span>
</div>
```

---

## 📐 SAFE AREAS (iOS Notch Support)

```css
/* Respect safe areas */
.safe-top {
  padding-top: env(safe-area-inset-top);
}

.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

.safe-left {
  padding-left: env(safe-area-inset-left);
}

.safe-right {
  padding-right: env(safe-area-inset-right);
}
```

---

## 🎨 ICON LIBRARY

**Using:**
- Hero Icons (outline & solid)
- Lucide Icons
- Custom poker icons (cards, chips, table)

```tsx
import {
  HomeIcon,
  PlayIcon,
  ChartBarIcon,
  UserIcon
} from '@heroicons/react/24/outline'
```

---

## 📦 COMPONENT STATES

### Loading State
```tsx
<div className="flex items-center justify-center h-full">
  <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent" />
</div>
```

### Empty State
```tsx
<div className="flex flex-col items-center justify-center h-full p-8 text-center">
  <span className="text-6xl mb-4">🎰</span>
  <h3 className="text-white font-bold text-xl mb-2">No active games</h3>
  <p className="text-gray-400 mb-6">Start your first poker game now!</p>
  <button className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold">
    Quick Play
  </button>
</div>
```

### Error State
```tsx
<div className="flex flex-col items-center justify-center h-full p-8 text-center">
  <span className="text-6xl mb-4">❌</span>
  <h3 className="text-white font-bold text-xl mb-2">Oops! Something went wrong</h3>
  <p className="text-gray-400 mb-6">We couldn't load this page</p>
  <button className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold">
    Try Again
  </button>
</div>
```

---

## 🚀 PERFORMANCE OPTIMIZATION

### Image Optimization
```tsx
import Image from 'next/image'

<Image
  src="/cards/ace-spades.webp"
  alt="Ace of Spades"
  width={64}
  height={96}
  priority // For above fold
  placeholder="blur" // With blurDataURL
/>
```

### Lazy Loading
```tsx
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false // Client-side only
})
```

### Virtual Scrolling
```tsx
// For long lists (leaderboard, hand history)
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={600}
  itemCount={1000}
  itemSize={80}
  width="100%"
>
  {Row}
</FixedSizeList>
```

---

## 📱 PWA CONFIGURATION

### manifest.json
```json
{
  "name": "PokerMind",
  "short_name": "PokerMind",
  "description": "The Future of Online Poker",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0F172A",
  "theme_color": "#8B5CF6",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

**Document créé le:** 2025-01-23
**Version:** 1.0
**Status:** PRODUCTION READY 📱
