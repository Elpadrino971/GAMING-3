# 🎨 POKERMIND - SPÉCIFICATIONS FIGMA PARTIE 2

## 📱 SCREEN 7: NFT MARKETPLACE

### **Layout Détaillé**

```
┌─────────────────────────────────┐
│ [←] NFT Market          [🔍][⚙️]│ Header 56px
├─────────────────────────────────┤
│                                 │ 16px top
│ ┌───────────────────────────┐   │
│ │  🎨 Featured Drop         │   │ Hero banner
│ │  "Royal Flush"            │   │ 200px height
│ │  Collection                │   │
│ │  [Mint Now →]             │   │
│ └───────────────────────────┘   │
│                                 │ 24px spacing
│ [All] [Avatars] [Cards] [Chips]│ Category tabs
│                                 │ 40px height
│                                 │ 16px spacing
│ Trending 🔥          [See All →]│ Section header
│                                 │ 12px spacing
│ ┌──────┐ ┌──────┐ ┌──────┐     │ NFT cards grid
│ │ 🎴   │ │ 🎴   │ │ 🎴   │     │ 111px width
│ │      │ │      │ │      │     │ 160px height
│ │ #125 │ │ #342 │ │ #891 │     │
│ │💎2.5 │ │💎3.8 │ │💎1.9 │     │
│ └──────┘ └──────┘ └──────┘     │
│                                 │ 24px spacing
│ Your Collection          [+]    │ Section header
│                                 │ 12px spacing
│ ┌──────┐ ┌──────┐ ┌──────┐     │
│ │ 🃏   │ │ 🎰   │ │ 👤   │     │
│ │ A♠️   │ │Chip  │ │Avatar│     │
│ │ #45  │ │ #789 │ │ #12  │     │
│ │Own 1 │ │Own 5 │ │Own 1 │     │
│ └──────┘ └──────┘ └──────┘     │
│                                 │
│                                 │ 80px bottom
├─────────────────────────────────┤
│ [🏠] [🎮] [📊] [👤]            │ Bottom nav
└─────────────────────────────────┘
```

### **Composants:**

**Hero Banner (Featured NFT):**
```
Container: Full width - 32px
Height: 200px
Background: Gradient (Purple/900 → Pink/900)
Border: 2px, Gold/500
Radius: Radius/Large (16px)
Padding: 24px
Shadow: Shadow/XL + Glow/Purple
Position: Relative

Content:
- Badge: "FEATURED" (top-left)
  * Background: Gold gradient
  * Text: Caption, White, Bold
  * Padding: 4px 12px
  * Radius: Radius/Full

- Title: Display/Large, White
- Collection name: Body/Medium, Gold/500
- Countdown timer:
  * Label/Large, White
  * Icon: ⏱️ 20x20px
  * Format: "23:45:12"

- CTA Button:
  * Width: 50%
  * Height: 48px
  * Background: Gold gradient
  * Text: H3, Black, "Mint Now →"
  * Position: Bottom-right
  * Shadow + Glow/Gold

Background:
- NFT preview image (blurred 80%)
- Overlay gradient for readability
```

**Category Tabs:**
```
Container: Horizontal scroll
Height: 40px
Padding: 0 16px
Gap: 8px

Tab:
- Width: Auto (min 80px)
- Height: 40px
- Background: Gray/800 (inactive)
- Background: Gradient Primary (active)
- Border: 2px, Gray/700 (inactive)
- Border: 2px, Purple/500 (active)
- Radius: Radius/Medium
- Padding: 8px 16px
- Text: Label/Medium, Gray/400 (inactive)
- Text: Label/Medium, White (active)

States:
- Inactive
- Active (gradient + border)
- Scrollable horizontally
```

**NFT Card (Component):**
```
Container: 111x160px
Background: Gray/800
Border: 2px, Gray/700
Radius: Radius/Medium (12px)
Shadow: Shadow/Medium
Overflow: Hidden

Structure:
┌───────────┐
│  Image    │ 111x111px (square top)
│           │
├───────────┤
│ #125      │ Token ID, Caption, Gray/400
│ 💎 2.5 ETH│ Price, Label/Medium, Gold/500
└───────────┘

Image Area:
- NFT image: 111x111px
- Background: Gray/900 (loading)
- Rarity badge (top-right):
  * Size: 24x24px
  * Background: Gold/Purple/Blue
  * Icon: ⭐/💎/🔥
  * Position: Absolute 4px from top-right

Info Area:
- Padding: 8px
- Height: 49px
- Token ID: Top, Caption
- Price: Bottom, Label/Medium, Bold

Hover State:
- Lift: 8px
- Border: Purple/500
- Glow: Purple
- Image: Scale 1.05
- Show quick action overlay

Quick Actions (on hover):
- View: 👁️
- Like: ❤️
- Position: Absolute center
```

**Section Header:**
```
Container: Full width - 32px
Height: Auto
Margin: 24px 0 12px

Content:
- Title: H3, White, left
- Action link: Body/Small, Purple/500, right
  * Text: "See All →"
  * Hover: Underline

Layout: Flex row, space-between
```

---

## 📱 SCREEN 8: WALLET & TRANSACTIONS

### **Layout Détaillé**

```
┌─────────────────────────────────┐
│ [←] Wallet               [⚙️]   │ Header 56px
├─────────────────────────────────┤
│                                 │ 16px top
│ ┌───────────────────────────┐   │
│ │ Total Balance             │   │ Balance card
│ │                           │   │ 160px height
│ │     $12,450.00            │   │
│ │                           │   │
│ │ ───────────────────────── │   │
│ │ 💰 Fiat: $8,200          │   │
│ │ 💎 Crypto: 0.82 ETH      │   │
│ │ 🎁 Bonus: $450           │   │
│ └───────────────────────────┘   │
│                                 │ 24px spacing
│ ┌──────────┐ ┌──────────┐      │ Action buttons
│ │+ DEPOSIT │ │- WITHDRAW│      │ 48px height
│ └──────────┘ └──────────┘      │
│                                 │ 24px spacing
│ Recent Transactions      [All →]│ Section header
│                                 │ 12px spacing
│ ┌───────────────────────────┐   │
│ │ 💰 Deposit                │   │ Transaction item
│ │ +$500.00                  │   │ 80px height
│ │ Dec 15, 2024 • 14:32      │   │
│ │ ✅ Completed              │   │
│ └───────────────────────────┘   │
│                                 │ 12px spacing
│ ┌───────────────────────────┐   │
│ │ 🎮 Cash Game Win          │   │
│ │ +$234.50                  │   │
│ │ Dec 15, 2024 • 12:15      │   │
│ │ ✅ Completed              │   │
│ └───────────────────────────┘   │
│                                 │ 12px spacing
│ ┌───────────────────────────┐   │
│ │ 🏆 Tournament Entry       │   │
│ │ -$100.00                  │   │
│ │ Dec 14, 2024 • 18:45      │   │
│ │ ✅ Completed              │   │
│ └───────────────────────────┘   │
│                                 │ 12px spacing
│ ┌───────────────────────────┐   │
│ │ 💎 NFT Purchase           │   │
│ │ -0.05 ETH                 │   │
│ │ Dec 14, 2024 • 16:20      │   │
│ │ ⏳ Pending                │   │
│ └───────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

### **Composants:**

**Total Balance Card:**
```
Container: Full width - 32px
Height: 160px
Background: Gradient (Gray/900 → Purple/900 15%)
Border: 2px, Purple/700
Radius: Radius/Large (16px)
Padding: 24px
Shadow: Shadow/Large + Glow/Purple (subtle)

Structure:
- Label: Body/Small, Gray/400, "Total Balance"
- Main Amount: Display/Large, White, center
  * Font size: 36px
  * Bold
  * Margin: 16px vertical

- Divider: 1px, Gray/800, full width

- Balance Breakdown (Grid 3 columns):
  * Icon: 20x20px
  * Label: Caption, Gray/400
  * Amount: Label/Medium, White
  * Layout: Stacked, centered per column

Animation:
- Numbers count up on load
- Subtle pulse on balance change
```

**Action Buttons:**
```
Container: Flex row
Gap: 16px
Padding: 0 16px

Button (2 buttons):
- Width: 50% - 8px
- Height: 48px
- Border: 2px
- Radius: Radius/Medium

Deposit Button:
- Background: Gradient (Success/600 → Success/700)
- Border: Success/500
- Text: H3, White, "+ DEPOSIT"
- Icon: ➕ 20x20px, left
- Glow: Success (subtle)

Withdraw Button:
- Background: Gray/800
- Border: Gray/700
- Text: H3, White, "- WITHDRAW"
- Icon: ➖ 20x20px, left

States:
- Default
- Pressed (scale 0.98)
- Disabled (opacity 50%)
```

**Transaction Item (Component):**
```
Container: Full width - 32px
Height: 80px
Background: Gray/800
Border: 2px, Gray/700
Radius: Radius/Medium (12px)
Padding: 16px
Shadow: Shadow/Small

Layout: Grid

Left Section (60%):
- Icon: 32x32px, top-left
  * Deposit: 💰 (green circle)
  * Withdrawal: 💸 (red circle)
  * Win: 🎮 (gold circle)
  * Loss: 😔 (gray circle)
  * NFT: 💎 (purple circle)
  * Tournament: 🏆 (gold circle)

- Title: Label/Large, White
- Timestamp: Caption, Gray/400
  * Format: "Dec 15, 2024 • 14:32"

Right Section (40%):
- Amount: Label/Large, aligned right
  * Positive (green): Success/500
  * Negative (red): Error/500
  * Format: "+$234.50" or "-$100.00"

- Status Badge: Bottom-right
  * Size: Auto x 24px
  * Padding: 4px 8px
  * Radius: Radius/Full

  States:
  - ✅ Completed: Success/500 bg, White text
  - ⏳ Pending: Warning/500 bg, White text
  - ❌ Failed: Error/500 bg, White text
  - 🔄 Processing: Info/500 bg, White text

Tap Action:
- Navigate to transaction details
- Haptic feedback
```

**Filter Bar (Optional):**
```
Container: Full width - 32px
Height: 40px
Margin: 16px 0
Gap: 8px
Scroll: Horizontal

Chip:
- Width: Auto
- Height: 40px
- Background: Gray/800 (inactive)
- Background: Purple/600 (active)
- Border: 2px, Gray/700 (inactive)
- Border: 2px, Purple/500 (active)
- Radius: Radius/Medium
- Padding: 8px 16px
- Text: Label/Medium

Options:
- All
- Deposits
- Withdrawals
- Games
- NFTs
- Bonuses
```

---

## 📱 SCREEN 9: AI COACH & TRAINING

### **Layout Détaillé**

```
┌─────────────────────────────────┐
│ [←] AI Coach             [⚙️]   │ Header 56px
├─────────────────────────────────┤
│                                 │ 16px top
│ 🤖 Your AI Coach                │ H2, White
│ Level: Expert                   │ Body/Small, Purple/500
│                                 │ 24px spacing
│ ┌───────────────────────────┐   │
│ │ 📊 Today's Performance    │   │ Stats card
│ │                           │   │ 140px height
│ │ ┌─────┐ ┌─────┐ ┌─────┐  │   │
│ │ │68%  │ │+$340│ │127  │  │   │ Metric blocks
│ │ │Win  │ │Profit│││Hands│  │   │
│ │ └─────┘ └─────┘ └─────┘  │   │
│ └───────────────────────────┘   │
│                                 │ 24px spacing
│ Recent Analysis 🎯       [All →]│ Section header
│                                 │ 12px spacing
│ ┌───────────────────────────┐   │
│ │ 🎴 Hand Review            │   │ Analysis card
│ │ A♠️K♠️ vs Q♥️Q♦️           │   │ 120px height
│ │                           │   │
│ │ ⭐⭐⭐⭐⚪               │   │ Rating
│ │ "Good pre-flop 3-bet"     │   │
│ │ [View Analysis →]         │   │
│ └───────────────────────────┘   │
│                                 │ 16px spacing
│ ┌───────────────────────────┐   │
│ │ ⚠️  Mistake Alert         │   │
│ │ K♣️J♣️ - River Call       │   │
│ │                           │   │
│ │ ⭐⭐⚪⚪⚪               │   │
│ │ "Should have folded"      │   │
│ │ [Learn More →]            │   │
│ └───────────────────────────┘   │
│                                 │ 24px spacing
│ Training Modules 📚              │ Section header
│                                 │ 12px spacing
│ ┌──────┐ ┌──────┐ ┌──────┐     │ Module cards
│ │ 📖   │ │ 🎯   │ │ 🧠   │     │ 111px width
│ │Pre-  │ │Pot   │ │GTO   │     │ 140px height
│ │Flop  │ │Odds  │ │Play  │     │
│ │ 75%  │ │ 92%  │ │ 43%  │     │ Progress %
│ └──────┘ └──────┘ └──────┘     │
│                                 │ 24px spacing
│ ┌───────────────────────────┐   │
│ │  🎓 START NEW SESSION     │   │ CTA button
│ └───────────────────────────┘   │ 56px height
│                                 │
└─────────────────────────────────┘
```

### **Composants:**

**Stats Card:**
```
Container: Full width - 32px
Height: 140px
Background: Gray/800
Border: 2px, Gray/700
Radius: Radius/Large (16px)
Padding: 20px
Shadow: Shadow/Medium

Header:
- Icon: 📊 24x24px, left
- Title: H3, White
- Time range: Caption, Gray/400, right
  * "Today" / "This Week" / "This Month"

Metrics Grid (3 columns):
Container per metric:
- Width: 33.33%
- Height: 80px
- Background: Gray/900
- Border: 1px, Gray/800
- Radius: Radius/Medium
- Padding: 12px
- Text align: Center

Content:
- Value: H1, Color-coded
  * Win rate: Success/500
  * Profit/Loss: Success/Error
  * Hands: Purple/500
- Label: Caption, Gray/400

States:
- Animate on load
- Pulse on update
```

**Hand Analysis Card (Component):**
```
Container: Full width - 32px
Height: 120px
Background: Gray/800
Border-left: 4px, color-coded
  * Good play: Success/500
  * Mistake: Error/500
  * Neutral: Info/500
Radius: Radius/Medium (12px)
Padding: 16px
Shadow: Shadow/Medium

Header:
- Icon: 🎴/⚠️/💡 24x24px
- Title: H3, White
- Timestamp: Caption, Gray/400, right

Hand Display:
- Cards: 40x60px each
- Format: "A♠️K♠️ vs Q♥️Q♦️"
- Spacing: 4px between cards
- Margin: 8px vertical

Rating:
- Stars: ⭐⭐⭐⭐⚪
- Size: 20x20px each
- Color: Gold/500 (filled), Gray/700 (empty)

AI Feedback:
- Text: Body/Small, Gray/300
- Background: Gray/900
- Padding: 8px
- Radius: Radius/Small
- Max 2 lines, truncate

CTA:
- Link: Body/Small, Purple/500, Semibold
- Text: "View Analysis →" or "Learn More →"
- Position: Bottom-right
- Hover: Underline

Tap Action:
- Navigate to detailed hand analysis
- Show full AI commentary
- Video replay (if available)
```

**Training Module Card (Component):**
```
Container: 111x140px
Background: Gray/800
Border: 2px, Gray/700
Radius: Radius/Medium (12px)
Padding: 16px
Shadow: Shadow/Medium

Structure:
┌───────────┐
│  📖       │ Icon 48x48px, top
│           │
│  Pre-Flop │ Title, Label/Medium
│           │
│ ━━━━━━━   │ Progress bar, 4px
│  75%      │ Percentage, Caption
└───────────┘

Progress Bar:
- Width: Full - 32px (padding)
- Height: 4px
- Background: Gray/900
- Fill: Gradient Primary
- Radius: Radius/Full
- Margin: 12px vertical

Badge (if new content):
- Position: Top-right
- Size: 20px circle
- Background: Error/500
- Text: "!" White, Bold
- Pulse animation

States:
- Default
- Completed (100%):
  * Border: Success/500
  * Checkmark overlay: ✅
- Locked (if premium):
  * Opacity: 60%
  * Lock icon: 🔒
  * Border: Gray/800
```

**Start Session Button:**
```
Container: Full width - 32px
Height: 56px
Background: Gradient Primary (Purple → Pink)
Radius: Radius/Large (16px)
Shadow: Shadow/Large + Glow/Purple
Text: H2, White, "🎓 START NEW SESSION"
Icon: 32x32px, left

States:
- Default (with glow)
- Pressed (scale 0.98)
- Loading (spinner + "Preparing...")

Tap Action:
- Start AI coaching session
- Load personalized training
- Haptic feedback
```

**AI Coach Avatar (Floating):**
```
Position: Fixed bottom-right
Size: 64x64px
Background: Gradient Primary
Border: 4px, White
Radius: Full
Shadow: Shadow/XL + Glow/Purple
Z-index: 100

Content:
- 🤖 Icon 32x32px, centered
- Notification badge (if tips available):
  * Size: 20px
  * Background: Error/500
  * Number: Caption, White

States:
- Idle: Subtle pulse
- Active: Rotate animation
- New tip: Strong pulse + bounce

Tap Action:
- Open AI chat overlay
- Show latest tip
- Voice activation (future)
```

---

## 📱 SCREEN 10: USER PROFILE

### **Layout Détaillé**

```
┌─────────────────────────────────┐
│ [←] Profile              [⚙️]   │ Header 56px
├─────────────────────────────────┤
│                                 │
│       ┌─────────┐               │ Profile header
│       │  👤     │               │ 200px height
│       │ Avatar  │               │
│       └─────────┘               │
│                                 │
│      PlayerPro                  │ H1, White, centered
│      @playerpro123              │ Body/Small, Gray/400
│                                 │
│  [✏️ Edit] [📤 Share] [➕]      │ Action buttons
│                                 │ 32px height
│                                 │ 24px spacing
│ ┌───────────────────────────┐   │
│ │ Level 12 🎯               │   │ Level card
│ │ [━━━━━━━━━━━━━━━━━━──] 82%│   │ 100px height
│ │ 450 XP to Level 13        │   │
│ └───────────────────────────┘   │
│                                 │ 24px spacing
│ ┌─────┐ ┌─────┐ ┌─────┐        │ Stats grid
│ │1.2K │ │ 68% │ │$12K │        │ 80px height
│ │Hands│ │Win% │ │Won  │        │ each
│ └─────┘ └─────┘ └─────┘        │
│                                 │ 24px spacing
│ Achievements 🏆          [All →]│ Section header
│                                 │ 12px spacing
│ ┌──────┐ ┌──────┐ ┌──────┐     │ Achievement badges
│ │ 🏆   │ │ 💎   │ │ 🎯   │     │ 80x80px each
│ │Royal │ │High  │ │Sharp│     │
│ │Flush │ │Roller│ │Eye  │     │
│ └──────┘ └──────┘ └──────┘     │
│                                 │ 24px spacing
│ NFT Collection 🎨        [All →]│ Section header
│                                 │ 12px spacing
│ ┌──────┐ ┌──────┐ ┌──────┐     │ NFT previews
│ │ 🎴   │ │ 🎰   │ │ 👤   │     │ 80x80px
│ │ #45  │ │ #789 │ │ #12  │     │
│ └──────┘ └──────┘ └──────┘     │
│                                 │ 24px spacing
│ Settings ⚙️                     │ Section header
│                                 │ 12px spacing
│ [👤 Account]                    │ Menu items
│ [🔔 Notifications]              │ 56px height
│ [🎨 Appearance]                 │ each
│ [💰 Payment Methods]            │
│ [🔒 Privacy & Security]         │
│ [❓ Help & Support]             │
│                                 │
│ [🚪 Logout]                     │ Logout button
│                                 │ 48px height
│                                 │
└─────────────────────────────────┘
```

### **Composants:**

**Profile Header:**
```
Container: Full width
Height: 200px
Background: Gradient (Purple/900 → Pink/900)
Padding: 24px 16px
Position: Relative

Cover (Background):
- Image or pattern
- Overlay: Black 40% opacity
- Blur: 10px

Avatar:
- Size: 96x96px
- Position: Center
- Background: Gray/800
- Border: 4px, White
- Radius: Full
- Shadow: Shadow/XL
- Image or emoji icon

Edit Button (on avatar):
- Position: Bottom-right of avatar
- Size: 32x32px
- Background: Purple/600
- Icon: ✏️ 16x16px, White
- Border: 2px, White
- Radius: Full
- Tap: Edit profile photo

Username:
- Font: H1, White, Bold
- Position: Below avatar, centered
- Margin: 16px top

Handle:
- Font: Body/Small, Gray/300
- Position: Below username, centered
- Format: "@username"
```

**Action Buttons Row:**
```
Container: Flex row
Gap: 12px
Padding: 0 16px
Margin: 24px 0

Button:
- Width: Calc((100% - 24px) / 3)
- Height: 32px
- Background: Gray/800
- Border: 2px, Gray/700
- Radius: Radius/Medium
- Text: Label/Small, White
- Icon: 16x16px, left

Edit Button:
- Icon: ✏️
- Text: "Edit"
- Border: Purple/500 (primary)

Share Button:
- Icon: 📤
- Text: "Share"

More Button:
- Icon: ➕
- Text: Hidden (icon only)
- Width: 32px (square)

States:
- Default
- Pressed (bg Gray/700)
```

**Level Progress Card:**
```
Container: Full width - 32px
Height: 100px
Background: Gradient (Gray/900 → Purple/900 10%)
Border: 2px, Purple/700
Radius: Radius/Large (16px)
Padding: 20px
Shadow: Shadow/Medium

Header:
- Icon: 🎯 24x24px, left
- Level: H2, White, "Level 12"
- Badge (optional): Small star icon

Progress Bar:
- Width: Full
- Height: 12px
- Background: Gray/800
- Fill: Gradient Primary
- Radius: Radius/Full
- Margin: 12px vertical
- Percentage text: Inside bar, right
  * Font: Label/Small, White, Bold

Next Level:
- Text: Body/Small, Purple/400
- Format: "450 XP to Level 13"
```

**Stats Block (Component):**
```
Container: Grid 3 columns
Gap: 16px
Padding: 0 16px

Stat Card:
- Width: Calc((100% - 32px) / 3)
- Height: 80px
- Background: Gray/800
- Border: 2px, Gray/700
- Radius: Radius/Medium
- Padding: 12px
- Text align: Center

Content:
- Value: H2, White, Bold
  * Format numbers: 1.2K, $12.5K
- Label: Caption, Gray/400
- Icon (optional): 20x20px, top

Animation:
- Count up on load
- Pulse on value change

Tap Action:
- Navigate to detailed stats
```

**Achievement Badge (Component):**
```
Container: 80x80px
Background: Gray/800
Border: 2px, color-coded
  * Common: Gray/700
  * Rare: Info/500
  * Epic: Purple/500
  * Legendary: Gold/500
Radius: Radius/Medium (12px)
Padding: 8px
Shadow: Shadow/Medium

Content:
- Icon: 40x40px, top-center
- Title: Caption, White, centered
  * Max 2 lines
  * Text overflow: Ellipsis

States:
- Locked:
  * Opacity: 50%
  * Icon: 🔒
  * Border: Gray/800
- Unlocked:
  * Border glow
  * Hover: Lift + glow stronger
- New:
  * Pulse animation
  * Badge: "NEW" top-right

Tap Action:
- Show achievement details modal
- Share achievement option
```

**Menu Item (Component):**
```
Container: Full width - 32px
Height: 56px
Background: Gray/800
Border: 2px, Gray/700 (top only, collapsed)
Radius: None (stacked list)
Padding: 16px
Shadow: None

First item: Radius top corners
Last item: Radius bottom corners

Content:
- Icon: 24x24px, left
  * Color: Purple/500
- Text: Label/Large, White
  * Margin-left: 12px from icon
- Chevron: 20x20px, right
  * Icon: →
  * Color: Gray/500

States:
- Default
- Pressed (bg Gray/700)
- Hover (on tablet): Border-left 4px Purple/500

Tap Action:
- Navigate to settings page
- Haptic feedback
```

**Logout Button:**
```
Container: Full width - 32px
Height: 48px
Background: Transparent
Border: 2px, Error/500
Radius: Radius/Medium
Text: Label/Large, Error/500, "🚪 Logout"
Icon: 20x20px, left

States:
- Default
- Pressed (bg Error/500, text White)

Tap Action:
- Show confirmation dialog
- Logout user
- Clear session
```

---

## 🎨 COMPOSANTS GLOBAUX ADDITIONNELS

### **Modal / Bottom Sheet (Generic)**

```
Overlay:
- Background: Black 60% opacity
- Blur: 4px (iOS) / Dim (Android)
- Tap: Close modal
- Animation: Fade in 200ms

Container:
- Width: 100%
- Max-height: 90vh
- Background: Gray/900
- Border-radius: 20px 20px 0 0 (bottom sheet)
- Border-radius: 16px (center modal)
- Padding: 24px
- Shadow: Shadow/XL upward
- Safe area bottom

Handle (bottom sheet only):
- Width: 40px
- Height: 4px
- Background: Gray/700
- Radius: Radius/Full
- Position: Top-center, 12px from top
- Draggable

Header:
- Height: 60px
- Border-bottom: 2px, Gray/800
- Padding: 16px 0

Title:
- Font: H2, White, left
- Close button: Right
  * Size: 40x40px
  * Icon: ✕ 20x20px
  * Background: Gray/800
  * Radius: Full

Content Area:
- Padding: 24px 0
- Scroll: Vertical if needed
- Max-height: Calc(90vh - 200px)

Footer (optional):
- Height: Auto
- Border-top: 2px, Gray/800
- Padding: 16px 0
- Safe area bottom
- Buttons: Primary + Secondary

Animations:
- Enter: Slide up 300ms ease-out
- Exit: Slide down 200ms ease-in
- Backdrop: Fade 200ms
```

### **Toast / Snackbar**

```
Container:
- Width: Full width - 32px
- Height: Auto (min 56px)
- Position: Fixed bottom (80px from bottom)
- Background: Gray/800
- Border: 2px, color-coded
  * Success: Success/500
  * Error: Error/500
  * Warning: Warning/500
  * Info: Info/500
- Radius: Radius/Medium
- Padding: 16px
- Shadow: Shadow/Large
- Z-index: 1000

Content:
- Icon: 24x24px, left, color-coded
- Message: Body/Medium, White
  * Max 2 lines
  * Truncate if too long
- Action button (optional):
  * Link text: Label/Medium, Purple/500
  * Position: Right or below message

Animation:
- Enter: Slide up + fade in 300ms
- Exit: Slide down + fade out 200ms
- Auto-dismiss: 4 seconds (configurable)

Dismiss:
- Swipe down
- Tap action button
- Tap anywhere (optional)
- Auto after timeout
```

### **Loading Spinner**

```
Size Options:
- Small: 20x20px
- Medium: 32x32px
- Large: 48x48px

Style:
- Type: Circular indeterminate
- Stroke: 3px (small), 4px (medium), 5px (large)
- Color: Gradient Primary animated
- Background: Gray/700 (track)

Animation:
- Rotation: 360deg in 1s
- Easing: Linear infinite
- Gradient shift: 2s

Usage Contexts:
- Button: Small, inline with text
- Card: Medium, centered
- Full page: Large, screen center
- Overlay: Large + backdrop

Full Page Loader:
- Overlay: Black 80% opacity
- Logo: 120x120px, pulsing
- Spinner: Large, below logo
- Text (optional): Body/Small, Gray/400
  * "Loading..." or custom message
```

### **Empty State**

```
Container:
- Width: Full width - 64px
- Height: Auto
- Padding: 48px 32px
- Text align: Center

Illustration:
- Size: 160x160px
- Type: Icon, emoji, or SVG
- Color: Gray/600
- Margin-bottom: 24px

Title:
- Font: H2, White
- Margin-bottom: 12px
- Example: "No transactions yet"

Description:
- Font: Body/Medium, Gray/400
- Max-width: 300px
- Margin: 0 auto 32px
- Example: "Your transaction history will appear here"

CTA Button (optional):
- Primary button
- Height: 48px
- Text: "Get Started" or context-specific
- Icon: Optional

Examples:
- Empty wallet: 💰 + "Make your first deposit"
- No hands: 🎴 + "Play your first game"
- No NFTs: 🎨 + "Explore marketplace"
- No stats: 📊 + "Complete a session"
```

### **Pull to Refresh**

```
Container:
- Height: 60px
- Position: Top of scrollable content
- Overflow: Hidden

Indicator:
- Size: 32x32px
- Position: Center
- Spinner: Gradient Primary
- Initial state: Hidden

States:
1. Idle: Hidden
2. Pulling (0-60px):
   - Show indicator
   - Scale: 0 to 1
   - Rotate based on pull distance
3. Ready to refresh (>60px):
   - Indicator full size
   - Color: Success/500
   - Haptic feedback
4. Refreshing:
   - Spinner animation
   - Height locked at 60px
5. Complete:
   - Checkmark: ✅
   - Fade out 300ms
   - Collapse to 0

Animation:
- Smooth spring physics
- Bounce on release
- Fade transitions
```

### **Skeleton Loader**

```
Container:
- Match component dimensions
- Background: Gray/800
- Radius: Match component

Shimmer Effect:
- Gradient:
  * Stop 1: Gray/800 - 0%
  * Stop 2: Gray/700 - 50%
  * Stop 3: Gray/800 - 100%
- Animation: Slide right infinite
- Duration: 1.5s
- Easing: Ease-in-out

Common Patterns:

Card Skeleton:
┌─────────────────┐
│ ▬▬▬▬▬ ▬▬▬      │ Header line
│ ▬▬▬▬▬▬▬▬▬      │ Content line 1
│ ▬▬▬▬▬▬▬        │ Content line 2
│ ▬▬▬            │ Small text
└─────────────────┘

List Item Skeleton:
┌─────────────────┐
│ ⬛ ▬▬▬▬▬▬▬     │ Icon + text
│ ⬛ ▬▬▬▬▬▬▬     │
│ ⬛ ▬▬▬▬▬▬▬     │
└─────────────────┘

Avatar Skeleton:
● ▬▬▬▬▬           (Circle + text)

Usage:
- Show while content loading
- Match final component structure
- Transition: Fade to real content
- Duration: Until data loaded
```

---

## 📱 PATTERNS D'INTERACTION

### **Gestures Mobiles**

```
Swipe Right (Navigation):
- Context: Most screens
- Action: Go back / Previous screen
- Velocity threshold: 100px/s
- Distance threshold: 50px
- Animation: Slide transition

Swipe Down (Refresh):
- Context: Lists, feeds
- Action: Pull to refresh
- See: Pull to Refresh component
- Haptic: On ready state

Swipe Left/Right (Cards):
- Context: Card stacks, carousels
- Action: Next/Previous item
- Snap points: Every 100%
- Resistance: 20px past bounds

Long Press:
- Context: Cards, avatars, buttons
- Action: Show context menu
- Duration: 500ms
- Haptic: On trigger
- Visual: Scale 0.95

Pinch to Zoom:
- Context: Images, cards, table view
- Min scale: 1x
- Max scale: 3x
- Animation: Spring physics
- Double tap: Toggle zoom

Drag and Drop:
- Context: Custom chip stacks
- Visual: Lift shadow + scale 1.1
- Drop zones: Highlight border
- Cancel: Release outside zone
```

### **Transitions**

```
Screen Transitions:

Push (Forward):
- Duration: 300ms
- Easing: Ease-out
- New screen: Slide in from right
- Old screen: Slide out to left (50% travel)
- iOS: Match system transition

Modal:
- Duration: 250ms
- Easing: Ease-out
- Modal: Slide up from bottom
- Backdrop: Fade in
- iOS: Sheet presentation style

Tab Switch:
- Duration: 150ms
- Easing: Ease-in-out
- Fade: Cross-fade content
- No slide (feels more instant)

Element Transitions:

Expand/Collapse:
- Duration: 200ms
- Easing: Ease-in-out
- Height: Animate from 0 to auto
- Opacity: Fade content

Fade:
- Duration: 150ms
- Easing: Linear
- Opacity: 0 to 1 or reverse

Scale:
- Duration: 200ms
- Easing: Ease-out
- Transform: Scale(0.8) to scale(1)
- Combine with fade

Slide:
- Duration: 250ms
- Easing: Ease-out
- Transform: TranslateY(-20px) to 0
```

### **Feedback**

```
Haptic Feedback (iOS):

Light Impact:
- Trigger: Tap small buttons, switches
- Intensity: Light

Medium Impact:
- Trigger: Tap primary buttons, cards
- Intensity: Medium

Heavy Impact:
- Trigger: Important actions, errors
- Intensity: Heavy

Selection:
- Trigger: Picker scroll, slider thumb
- Type: Selection changed

Success:
- Trigger: Action completed
- Type: Notification success

Warning:
- Trigger: Invalid input, mistakes
- Type: Notification warning

Error:
- Trigger: Failed action
- Type: Notification error

Sound Effects (Optional):

Card Deal:
- File: card_deal.mp3
- Volume: 60%
- Duration: 200ms

Chip Stack:
- File: chip_stack.mp3
- Volume: 70%
- Duration: 300ms

Win:
- File: win_chime.mp3
- Volume: 80%
- Duration: 1s

Button Tap:
- File: tap.mp3
- Volume: 40%
- Duration: 50ms

Notification:
- File: notification.mp3
- Volume: 70%
- Duration: 500ms

Settings:
- User toggle: Enable/disable sounds
- Volume control: 0-100%
- Respect system settings
```

---

## 🎯 GUIDELINES FINALES

### **Accessibilité**

```
Touch Targets:
- Minimum: 44x44px (iOS HIG)
- Recommended: 48x48px
- Spacing: 8px between targets

Text Contrast:
- Normal text (< 18px): 4.5:1 minimum
- Large text (≥ 18px): 3:1 minimum
- Interactive elements: 3:1 minimum

Dynamic Type Support:
- Use semantic text styles
- Test at largest size
- Allow text to wrap
- Don't truncate critical info

Color:
- Don't rely on color alone
- Use icons + text
- Provide patterns/textures
- Test for color blindness

VoiceOver/TalkBack:
- All interactive elements labeled
- Meaningful button descriptions
- Announced state changes
- Grouped related elements
```

### **Performance**

```
Images:
- Format: WebP (fallback: PNG/JPG)
- Avatars: 96x96px @2x = 192x192px
- Cards: 200x300px @2x = 400x600px
- NFTs: 512x512px max
- Compress: 80% quality
- Lazy load: Below fold images

Animations:
- Use transform (not position)
- Use opacity (not visibility)
- 60fps target
- GPU acceleration
- Reduce motion option

Data Loading:
- Skeleton loaders for > 200ms
- Optimistic UI updates
- Cache frequently accessed
- Infinite scroll pagination (20 items)
- Prefetch next page

Bundle Size:
- Code splitting by route
- Lazy load heavy features
- Tree shaking
- Minify production
```

### **États d'Erreur**

```
Network Error:
- Icon: 📡 or ⚠️
- Title: "Connection Lost"
- Message: "Check your internet connection"
- CTA: "Try Again" button
- Background action: Auto-retry 3 times

Not Found:
- Icon: 🔍 or 404
- Title: "Page Not Found"
- Message: "This page doesn't exist"
- CTA: "Go Home" button

Server Error:
- Icon: ⚠️
- Title: "Something Went Wrong"
- Message: "We're working on it"
- CTA: "Try Again" button
- Show error code (optional)

Permission Denied:
- Icon: 🔒
- Title: "Access Denied"
- Message: Context-specific
- CTA: "Learn More" or "Unlock"

Validation Error:
- Show inline below field
- Icon: ⚠️ 16x16px, Error/500
- Text: Caption, Error/500
- Border: Field border Error/500
- Clear on input change
```

### **Offline Mode**

```
Indicators:
- Banner: Top of screen
  * Background: Warning/500
  * Text: "You're offline"
  * Icon: 📡
  * Dismissible: No

Functionality:
- Cached data: Show last loaded
- Disable: Actions requiring network
- Queue: Actions for when online
- Notify: "Will sync when online"

Storage:
- Profile data: 7 days cache
- Game history: Last 100 hands
- NFT images: Favorite collection
- Settings: Always available
```

---

## 📋 CHECKLIST DÉVELOPPEMENT

### **Avant de commencer:**
- [ ] Design system créé dans Figma
- [ ] Tokens définis (colors, spacing, typography)
- [ ] Components library créée
- [ ] Prototype interactif réalisé
- [ ] User testing complété
- [ ] Feedback intégré

### **Composants Core:**
- [ ] Buttons (Primary, Secondary, Ghost, Icon)
- [ ] Inputs (Text, Password, Select, Checkbox, Radio)
- [ ] Cards (Game, NFT, Transaction, Profile)
- [ ] Navigation (Header, Bottom tabs, Drawer)
- [ ] Modals (Bottom sheet, Center modal, Alert)
- [ ] Lists (Simple, Complex, Infinite scroll)
- [ ] Loading states (Spinner, Skeleton, Pull-refresh)
- [ ] Empty states (All contexts)
- [ ] Error states (All scenarios)

### **Screens:**
- [ ] Splash / Onboarding
- [ ] Authentication (Login, Register, Forgot password)
- [ ] Home Dashboard
- [ ] Table Lobby
- [ ] Game Table
- [ ] Raise Selector
- [ ] NFT Marketplace
- [ ] Wallet & Transactions
- [ ] AI Coach
- [ ] Profile & Settings

### **Interactions:**
- [ ] Touch gestures implemented
- [ ] Haptic feedback integrated
- [ ] Sound effects (optional)
- [ ] Animations smooth (60fps)
- [ ] Transitions consistent
- [ ] Loading states everywhere

### **Responsive:**
- [ ] Mobile (375px - 428px)
- [ ] Tablet (768px - 1024px)
- [ ] Landscape mode supported
- [ ] Safe areas respected
- [ ] Dynamic Island (iPhone 14+)
- [ ] Notch/Punch-hole handled

### **Accessibilité:**
- [ ] Color contrast WCAG AA
- [ ] Touch targets ≥ 44px
- [ ] VoiceOver labels
- [ ] Dynamic type support
- [ ] Reduce motion option
- [ ] Keyboard navigation (tablet)

### **Performance:**
- [ ] Images optimized
- [ ] Lazy loading implemented
- [ ] Code splitting by route
- [ ] 60fps animations
- [ ] Bundle size < 2MB
- [ ] First paint < 2s

### **Testing:**
- [ ] iOS (14, 15, 16, 17)
- [ ] Android (11, 12, 13, 14)
- [ ] Light/Dark mode
- [ ] RTL support (if needed)
- [ ] Offline mode
- [ ] Slow network (3G)

---

## 🎨 EXPORT FIGMA

### **Pour les développeurs:**

```
Assets à exporter:

Icons:
- Format: SVG
- Size: 24x24px base
- Export: @1x, @2x, @3x
- Naming: icon-name-size.svg

Images:
- Format: WebP + PNG fallback
- Sizes: @1x, @2x, @3x
- Optimization: 80% quality
- Naming: image-name-size@2x.webp

Components:
- Export as code (CSS/React)
- Document props and states
- Include animations specs
- Provide usage examples

Design Tokens:
- Export as JSON
- Include all values
- Group by category
- Version control

Prototypes:
- Share view-only link
- Public URL for stakeholders
- Interactive flows
- Annotated with notes
```

---

**🎉 SPÉCIFICATIONS COMPLÈTES!**

Ce document de **Part 2** couvre:
- ✅ Screen 7: NFT Marketplace
- ✅ Screen 8: Wallet & Transactions
- ✅ Screen 9: AI Coach & Training
- ✅ Screen 10: User Profile
- ✅ Composants globaux additionnels
- ✅ Patterns d'interaction
- ✅ Guidelines finales (accessibilité, performance, etc.)
- ✅ Checklist complète pour développement

**Total: 10 screens + système complet prêt pour développement!** 🚀

Questions? Besoin de détails supplémentaires sur une partie? 🎨
