# 🎨 POKERMIND - SPÉCIFICATIONS FIGMA COMPLÈTES

## 📐 CONFIGURATION FIGMA

### **Frame Setup**

**Mobile Frames (iPhone 14 Pro):**
```
Width: 393px
Height: 852px
Safe Area Top: 59px (Dynamic Island)
Safe Area Bottom: 34px (Home indicator)
```

**Tablet Frames (iPad Pro 11"):**
```
Width: 834px
Height: 1194px
Safe Area Top: 24px
Safe Area Bottom: 20px
```

### **Grid System**

**Mobile Grid:**
```
Columns: 4
Gutter: 16px
Margin: 16px
```

**Tablet Grid:**
```
Columns: 8
Gutter: 24px
Margin: 24px
```

---

## 🎨 DESIGN TOKENS (À CRÉER DANS FIGMA)

### **Colors (Styles)**

**Primary Palette:**
```
Purple/500: #8B5CF6
Purple/600: #7C3AED
Purple/700: #6D28D9

Pink/500: #EC4899
Pink/600: #DB2777
Pink/700: #BE185D

Gold/500: #FBBF24
Gold/600: #F59E0B
Gold/700: #D97706
```

**Neutral Palette:**
```
Gray/50: #F9FAFB
Gray/100: #F3F4F6
Gray/200: #E5E7EB
Gray/300: #D1D5DB
Gray/400: #9CA3AF
Gray/500: #6B7280
Gray/600: #4B5563
Gray/700: #374151
Gray/800: #1F2937
Gray/900: #111827
Black: #000000
White: #FFFFFF
```

**Semantic Colors:**
```
Success/500: #22C55E
Success/600: #16A34A

Error/500: #EF4444
Error/600: #DC2626

Warning/500: #F59E0B
Warning/600: #D97706

Info/500: #3B82F6
Info/600: #2563EB
```

**Game Colors:**
```
Table Green: #1E7A1E
Chip Red: #DC2626
Chip Blue: #2563EB
Chip Green: #16A34A
Chip Black: #171717
Chip Purple: #9333EA
Chip Gold: #D4AF37
```

### **Gradients (Styles)**

**Primary Gradient:**
```
Type: Linear
Angle: 135deg
Stop 1: Purple/500 (#8B5CF6) - 0%
Stop 2: Pink/500 (#EC4899) - 100%
```

**Gold Gradient:**
```
Type: Linear
Angle: 135deg
Stop 1: Gold/500 (#FBBF24) - 0%
Stop 2: Gold/700 (#D97706) - 100%
```

**Success Gradient:**
```
Type: Linear
Angle: 135deg
Stop 1: Success/500 (#22C55E) - 0%
Stop 2: Success/600 (#16A34A) - 100%
```

**Glass Effect:**
```
Type: Linear
Angle: 180deg
Stop 1: White 10% opacity - 0%
Stop 2: White 5% opacity - 100%
Background Blur: 20px
```

### **Typography (Text Styles)**

**Font Family:**
```
Primary: SF Pro Display (iOS) / Roboto (Android)
Fallback: -apple-system, system-ui
```

**Text Styles à créer:**

**Display:**
```
Display/Large
Font: SF Pro Display Bold
Size: 36px
Line Height: 44px
Letter Spacing: -0.5px
```

**Headings:**
```
H1
Font: SF Pro Display Bold
Size: 30px
Line Height: 38px
Letter Spacing: -0.5px

H2
Font: SF Pro Display Bold
Size: 24px
Line Height: 32px
Letter Spacing: -0.3px

H3
Font: SF Pro Display Semibold
Size: 20px
Line Height: 28px
Letter Spacing: 0px
```

**Body:**
```
Body/Large
Font: SF Pro Text Regular
Size: 17px
Line Height: 24px

Body/Medium
Font: SF Pro Text Regular
Size: 15px
Line Height: 22px

Body/Small
Font: SF Pro Text Regular
Size: 13px
Line Height: 18px
```

**Labels:**
```
Label/Large
Font: SF Pro Text Semibold
Size: 15px
Line Height: 20px

Label/Medium
Font: SF Pro Text Semibold
Size: 13px
Line Height: 18px

Label/Small
Font: SF Pro Text Semibold
Size: 11px
Line Height: 16px
```

**Captions:**
```
Caption/Regular
Font: SF Pro Text Regular
Size: 11px
Line Height: 14px
Color: Gray/400
```

### **Effects (Styles)**

**Shadows:**
```
Shadow/Small
X: 0, Y: 1px
Blur: 2px
Spread: 0
Color: Black 5% opacity

Shadow/Medium
X: 0, Y: 4px
Blur: 8px
Spread: 0
Color: Black 10% opacity

Shadow/Large
X: 0, Y: 8px
Blur: 16px
Spread: 0
Color: Black 15% opacity

Shadow/XL (Cards)
X: 0, Y: 12px
Blur: 24px
Spread: 0
Color: Black 20% opacity
```

**Glows (for premium elements):**
```
Glow/Purple
X: 0, Y: 0
Blur: 20px
Spread: 0
Color: Purple/500 50% opacity

Glow/Gold
X: 0, Y: 0
Blur: 20px
Spread: 0
Color: Gold/500 50% opacity
```

**Blur:**
```
Blur/Background
Blur: 20px (for glassmorphism)
```

### **Spacing (8pt Grid)**

```
Space/1: 4px
Space/2: 8px
Space/3: 12px
Space/4: 16px
Space/5: 20px
Space/6: 24px
Space/8: 32px
Space/10: 40px
Space/12: 48px
Space/16: 64px
```

### **Border Radius**

```
Radius/Small: 8px (inputs, small cards)
Radius/Medium: 12px (buttons, cards)
Radius/Large: 16px (modals, large cards)
Radius/XL: 20px (bottom sheets)
Radius/Full: 999px (pills, chips)
```

### **Border Width**

```
Border/Thin: 1px
Border/Medium: 2px
Border/Thick: 4px
```

---

## 📱 SCREEN 1: SPLASH SCREEN (Onboarding)

### **Layout**

```
┌─────────────────────────────────┐
│                                 │ 160px top padding
│          [LOGO 3D]              │
│        🎰 PokerMind             │ 120x120px logo
│                                 │
│      The Future of              │ H2, Gray/400
│      Online Poker               │
│                                 │ 40px spacing
│                                 │
│    [Progress Bar 60%]           │ 240px width, 4px height
│        Loading...               │ Caption, Gray/500
│                                 │
│                                 │
│                                 │
│                                 │
└─────────────────────────────────┘
```

### **Éléments à créer:**

**Logo:**
- 3D poker chip avec "PM" au centre
- Gradient Purple/Pink
- Shadow/XL
- Glow/Purple

**Progress Bar:**
- Container: 240x4px, Gray/800, Radius/Full
- Fill: Gradient Primary, Radius/Full
- Animated (left to right)

**Typography:**
- "PokerMind": Display/Large, White
- Tagline: Body/Large, Gray/400
- "Loading...": Caption/Regular, Gray/500

---

## 📱 SCREEN 2: LOGIN / REGISTER

### **Layout Détaillé**

```
┌─────────────────────────────────┐
│ [←]            POKERMIND        │ 56px header
├─────────────────────────────────┤
│                                 │ 24px top
│   Welcome Back! 👋              │ H1, White, centered
│                                 │ 32px spacing
│   ┌─────────────────────────┐   │
│   │ 📧 Email                │   │ Input, 48px height
│   └─────────────────────────┘   │
│                                 │ 16px spacing
│   ┌─────────────────────────┐   │
│   │ 🔒 Password             │   │ Input, 48px height
│   └─────────────────────────┘   │
│                                 │ 12px spacing
│   [Forgot Password?]            │ Body/Small, Purple/500
│                                 │ 24px spacing
│   ┌─────────────────────────┐   │
│   │    🚀 LOGIN             │   │ Button, 48px height
│   └─────────────────────────┘   │
│                                 │ 32px spacing
│   ────── OR LOGIN WITH ──────   │ Caption, Gray/500
│                                 │ 24px spacing
│   [🔗 Wallet] [🎮 Google]      │ Social buttons
│   [📱 Apple]                    │ 40px height each
│                                 │ 32px spacing
│   Don't have an account?        │ Body/Small, Gray/400
│   [Sign Up]                     │ Body/Small, Purple/500
│                                 │
└─────────────────────────────────┘
```

### **Composants à créer:**

**Header:**
- Height: 56px
- Background: Gray/900 with blur
- Border bottom: 1px, Gray/800
- Back button (left): IconButton 44x44px
- Title (center): H3, White
- Safe area top

**Input Field (Component):**
```
Container: 361x48px (full width - 32px margins)
Background: Gray/800
Border: 2px, Gray/700 (default)
Border: 2px, Purple/500 (focus)
Radius: Radius/Medium (12px)
Padding: 12px 16px
Icon (left): 24x24px, Gray/400
Text: Body/Medium, White
Placeholder: Body/Medium, Gray/400

States:
- Default (gray border)
- Focus (purple border + glow)
- Error (red border)
- Success (green border)
```

**Primary Button (Component):**
```
Container: 361x48px
Background: Gradient Primary (Purple→Pink)
Radius: Radius/Medium (12px)
Shadow: Shadow/Medium
Text: Label/Large, White, centered
Icon (optional): 20x20px, left or right

States:
- Default
- Hover (brightness +10%)
- Pressed (scale 0.98)
- Disabled (opacity 50%)
```

**Social Button (Component):**
```
Container: 113x40px (3 buttons fit avec 8px gap)
Background: Gray/800
Border: 2px, Gray/700
Radius: Radius/Medium (12px)
Icon: 20x20px, centered
Text: Hidden (icon only)

States:
- Default
- Hover (bg Gray/700)
- Pressed
```

**Link Text:**
```
Font: Body/Small, Semibold
Color: Purple/500
Underline: None (default)
Underline: 1px (hover)
```

---

## 📱 SCREEN 3: HOME DASHBOARD

### **Layout Détaillé**

```
┌─────────────────────────────────┐
│ ☰  POKERMIND            [🔔 3] │ Header 56px
├─────────────────────────────────┤
│                                 │ 16px top
│ Hey, PlayerPro! 🎰              │ H2, White
│ Level 12 • 2,450 XP             │ Body/Small, Gray/400
│ [━━━━━━━━━━━━━━━━━━━━──] 82%   │ Progress bar, 8px height
│                                 │ 24px spacing
│ ┌───────────────────────────┐   │
│ │ 💰 Balance                │   │ Balance Card
│ │ $12,450.00                │   │
│ │ ───────────────────────── │   │
│ │ Win Rate: 65.3% ↗ +2.1%  │   │
│ └───────────────────────────┘   │
│                                 │ 16px spacing
│ ┌───────────────────────────┐   │
│ │   🎮 QUICK PLAY           │   │ CTA Button, 64px height
│ └───────────────────────────┘   │
│                                 │ 24px spacing
│ Game Modes                      │ H3, White
│                                 │ 12px spacing
│ ┌──────┐ ┌──────┐ ┌──────┐     │ Mode cards, 111px width
│ │ 💰   │ │ 🏆   │ │ ⚡   │     │ 140px height
│ │Cash  │ │Tourn.│ │Spin  │     │
│ │Game  │ │      │ │& Go  │     │
│ └──────┘ └──────┘ └──────┘     │
│                                 │ 24px spacing
│ Active Tables 🔥                │ H3, White
│ [View All →]                    │ Body/Small, Purple/500, right
│                                 │ 12px spacing
│ ┌───────────────────────────┐   │
│ │ 🎰 NL50 • 6/9 👥          │   │ Table card
│ │ Pot: $125                 │   │ 120px height
│ │ Stakes: $0.25/$0.50       │   │
│ │ [JOIN →]                  │   │ Small button
│ └───────────────────────────┘   │
│                                 │ 16px spacing
│ ┌───────────────────────────┐   │
│ │ 🎰 NL100 • 8/9 👥         │   │
│ │ Pot: $280                 │   │
│ │ Stakes: $0.50/$1.00       │   │
│ │ [JOIN →]                  │   │
│ └───────────────────────────┘   │
│                                 │
│                                 │ 80px bottom padding
├─────────────────────────────────┤
│ [🏠] [🎮] [📊] [👤]            │ Bottom nav 64px
└─────────────────────────────────┘
```

### **Composants à créer:**

**Header (Component):**
```
Height: 56px
Background: Gray/900 with blur
Border bottom: 1px, Gray/800
Padding: 0 16px

Left: Menu icon 24x24px
Center: Logo + Text "POKERMIND"
Right: Notification bell with badge

Badge (notification):
- Size: 20x20px
- Background: Error/500
- Text: Caption, White, Bold
- Position: top-right of icon
```

**XP Progress Card:**
```
Container: Full width - 32px
Height: Auto
Background: Gradient subtle (Gray/900 → Gray/800)
Border: 2px, Gray/800
Radius: Radius/Large (16px)
Padding: 16px
Shadow: Shadow/Medium

Content:
- Greeting: H2, White
- Level info: Body/Small, Gray/400
- Progress bar:
  * Height: 8px
  * Background: Gray/800
  * Fill: Gradient Primary
  * Radius: Radius/Full
  * Text below: Caption, Purple/500, "450 XP to Level 13"
```

**Balance Card:**
```
Container: Full width - 32px
Height: 120px
Background: Gradient Dark (Gray/900 → Purple/900 10%)
Border: 2px, Purple/800
Radius: Radius/Large (16px)
Padding: 20px
Shadow: Shadow/Large

Content:
- Icon: 💰 28x28px
- Label: Body/Small, Gray/400, "Balance"
- Amount: Display/Large, White, "$12,450.00"
- Divider: 1px, Gray/800, margin 12px vertical
- Win Rate: Body/Small, Gray/400
- Percentage: Body/Medium, Success/500, "65.3%"
- Change: Caption, Success/500, "↗ +2.1%"
```

**Quick Play Button (Hero CTA):**
```
Container: Full width - 32px
Height: 64px
Background: Gradient Primary (Purple→Pink)
Radius: Radius/Large (16px)
Shadow: Shadow/Large + Glow/Purple
Text: H2, White, "🎮 QUICK PLAY"
Icon: 32x32px

States:
- Default (with glow)
- Pressed (scale 0.98, glow stronger)
- Loading (spinner)
```

**Mode Card (Component):**
```
Container: 111x140px
Background: Gray/800
Border: 2px, Gray/700
Radius: Radius/Medium (12px)
Padding: 16px
Shadow: Shadow/Medium

Content:
- Icon: 48x48px, top, centered
- Title: Label/Medium, White, centered
- Subtitle: Caption, Gray/400, centered

States:
- Default
- Hover (border Purple/500, lift 4px)
- Active (border Purple/500, glow)
```

**Table Card (Component):**
```
Container: Full width - 32px
Height: 120px
Background: Gray/800
Border: 2px, Gray/700
Radius: Radius/Medium (12px)
Padding: 16px
Shadow: Shadow/Medium

Content:
- Header row:
  * Icon + Name: H3, White
  * Players: Body/Small, Gray/400
  * Live badge: If active
- Pot: Body/Medium, Gold/500
- Stakes: Body/Small, Gray/400
- Join button:
  * Width: 80px, Height: 32px
  * Background: Purple/600
  * Text: Label/Small, White
  * Position: Bottom right

Live Badge:
- Container: Auto x 20px
- Background: Success/500
- Text: "LIVE" Caption, White, Bold
- Radius: Radius/Full
- Padding: 4px 8px
- With pulse animation
```

**Bottom Navigation (Component):**
```
Container: Full width
Height: 64px + safe area bottom
Background: Gray/900
Border top: 2px, Gray/800
Padding: 8px 0 + safe area bottom

Items (4 total):
- Width: 25% each
- Height: 48px
- Flex column, centered

Icon: 28x28px
Label: Caption, Weight: Semibold

States:
- Active: Icon + Text Purple/500
- Inactive: Icon + Text Gray/400
- Pressed: Scale 0.95
```

---

## 📱 SCREEN 4: TABLE LOBBY

### **Layout Détaillé**

```
┌─────────────────────────────────┐
│ [←] Cash Games            [⚙️] │ Header 56px
├─────────────────────────────────┤
│                                 │ 16px top
│ [All ▼] [NL ▼] [$ ▼]          │ Filters, 40px height
│                                 │ 16px spacing
│ ┌───────────────────────────┐   │
│ │ 🎰 NL50                   │   │ Table card full
│ │                           │   │ 200px height
│ │ 👥 6/9 Players            │   │
│ │ 💰 Avg Pot: $45           │   │
│ │ ⚡ 75 hands/hr            │   │
│ │ 📊 Skill: Medium          │   │
│ │                           │   │
│ │ Stakes: $0.25/$0.50       │   │
│ │                           │   │
│ │ ┌───────────────────────┐ │   │
│ │ │  JOIN TABLE →         │ │   │ 48px button
│ │ └───────────────────────┘ │   │
│ └───────────────────────────┘   │
│                                 │ 16px spacing
│ ┌───────────────────────────┐   │
│ │ 🎰 NL100                  │   │
│ │ [LIVE] 🔥                 │   │
│ │ 👥 8/9 Players            │   │
│ │ 💰 Avg Pot: $85           │   │
│ │ ⚡ 62 hands/hr            │   │
│ │ 📊 Skill: High            │   │
│ │ Stakes: $0.50/$1.00       │   │
│ │ [JOIN TABLE →]            │   │
│ └───────────────────────────┘   │
│                                 │
│ [Load More]                     │ Ghost button
│                                 │
└─────────────────────────────────┘
```

### **Composants:**

**Filter Chips:**
```
Container: Auto x 40px
Background: Gray/800
Border: 2px, Gray/700
Radius: Radius/Medium (12px)
Padding: 8px 16px
Text: Label/Medium, White
Icon: Chevron down 16x16px

States:
- Default
- Active (border Purple/500, bg Purple/900)
- Dropdown open
```

**Extended Table Card:**
```
Container: Full width - 32px
Height: 200px
Background: Gradient (Gray/900 → Gray/800)
Border: 2px, Gray/700
Radius: Radius/Large (16px)
Padding: 20px
Shadow: Shadow/Large

Header:
- Icon + Name: H2, White
- Live badge: If applicable

Info Grid (2 columns):
Row 1: Players | Avg Pot
Row 2: Hands/hr | Skill Level
Each: Icon + Label + Value

Stakes:
- Label/Large, Gray/400
- Prominent display

Join Button:
- Full width inside card
- Height: 48px
- Gradient Primary
- H3, White

Hover State:
- Border: Purple/500
- Lift: 8px
- Glow: Purple
- Join button glow stronger
```

---

## 📱 SCREEN 5: POKER TABLE (Game View)

### **Layout Détaillé**

```
┌─────────────────────────────────┐
│ [←] NL50  $125         [⚙️ ⓘ] │ Header 56px
├─────────────────────────────────┤
│                                 │
│    👤        👤        👤       │ Opponent row 1
│   $500      $320      $780      │ 60px height
│   [Cards]   [Cards]   [Cards]   │
│                                 │
│  👤                        👤   │ Opponent row 2
│ $450                      $620  │ Side players
│ [Cards]                [Cards]  │
│                                 │
│ ┌───────────────────────────┐   │ Table felt
│ │                           │   │ 240px height
│ │    🃏 🃏 🃏 🃏 🃏         │   │ Community 80x120px/card
│ │                           │   │
│ │        💰 $125            │   │ Pot display
│ │                           │   │
│ │         [D]               │   │ Dealer button
│ └───────────────────────────┘   │
│                                 │
│  👤                        👤   │ Opponent row 3
│ $380                      $510  │
│ [Cards]                [Cards]  │
│                                 │
│        🃏🃏                     │ Your cards (large)
│       A♠️ K♠️                   │ 100x150px each
│                                 │
│ ⏱️ 15s [━━━━━━━━━━━━━━──]      │ Timer 32px height
│                                 │
├─────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐      │ Actions 140px
│ │   FOLD   │ │ CALL $50 │      │
│ └──────────┘ └──────────┘      │ 56px height
│ ┌───────────────────────────┐   │
│ │    🚀 RAISE              │   │ 56px height
│ └───────────────────────────┘   │
└─────────────────────────────────┘
```

### **Composants:**

**Game Header:**
```
Height: 56px
Background: Black 80% opacity, blur
Position: Absolute top

Left: Back button
Center: Table name + Pot
Right: Settings + Info icons

Overlay on game, not pushing content
```

**Player Avatar (Component):**
```
Container: 80x60px
Background: Gray/800
Border: 2px, Gray/700 (default)
Border: 2px, Success/500 (active turn)
Radius: Radius/Medium (12px)
Shadow: Shadow/Medium

Content:
- Avatar icon: 32x32px, top
- Name: Caption, White, truncate
- Stack: Label/Small, Gold/500

States:
- Inactive (gray border)
- Active turn (green border, glow)
- Folded (opacity 50%)
- All-in (red border)

Cards position: Below avatar
- 2 cards, 32x48px each
- Overlap 50%
- Face down: Blue back
- Face up: White with rank/suit
```

**Table Felt (Component):**
```
Container: Full width - 32px
Height: 240px
Background: Radial gradient (Table Green dark → light)
Border: 8px, Brown (wood rail)
Radius: Radius/XL (20px)
Shadow: Inner shadow for depth

Center:
- Community cards (5 max)
  * Size: 80x120px each
  * Spacing: 8px
  * Animation: Flip on reveal

- Pot display:
  * Icon: 💰 32x32px
  * Amount: H1, Gold/500
  * Position: Below cards

- Dealer button:
  * Size: 40x40px
  * Background: Gold gradient
  * Text: "D", White, Bold
  * Border: 2px, White
  * Shadow + Glow
  * Position: Rotates around table
```

**Your Cards (Component):**
```
Size: 100x150px each
Position: Bottom center
Spacing: -20px overlap
Background: White
Border: 4px, Gold/500
Radius: Radius/Medium (12px)
Shadow: Shadow/XL + Glow/Gold

Content:
- Rank: 48px, Bold
- Suit: 56px
- Corner mini: 20px rank + suit

Animation:
- Deal: Slide from center
- Peek: Slight rotation on tap
```

**Action Timer (Component):**
```
Container: Full width - 32px
Height: 32px
Margin: 16px

Progress bar:
- Height: 8px
- Background: Gray/800
- Fill: Gradient (Green → Yellow → Red)
- Radius: Radius/Full
- Animation: Shrink left to right

Time display:
- Position: Absolute right
- Font: Label/Large, White, Bold
- Background: Black 60% opacity
- Padding: 4px 8px
- Radius: Radius/Small

States:
- Normal (15-30s): Green
- Warning (5-15s): Yellow
- Critical (0-5s): Red + pulse
```

**Action Buttons (Component):**
```
Container: Full width - 32px
Height: 140px total
Padding: 16px
Background: Gradient (Gray/900 → Black)
Border top: 2px, Gray/800

Layout: Grid

Row 1 (2 buttons side by side):
- FOLD button:
  * Width: 48%
  * Height: 56px
  * Background: Gradient (Red/600 → Red/700)
  * Text: H3, White, "FOLD"
  * Icon: 🚫

- CALL/CHECK button:
  * Width: 48%
  * Height: 56px
  * Background: Gradient (Blue/600 → Blue/700) for CHECK
  * Background: Gradient (Success/600 → Success/700) for CALL
  * Text: H3, White, "CHECK" or "CALL $50"
  * Icon: ✅ or 💰

Row 2 (1 full width button):
- RAISE button:
  * Width: 100%
  * Height: 56px
  * Background: Gradient Primary (Purple → Pink)
  * Text: H3, White, "🚀 RAISE"
  * Glow: Strong
  * Prominent, main action

Spacing: 8px between buttons

States (all buttons):
- Default
- Pressed (scale 0.98)
- Disabled (opacity 30%, no interaction)
```

---

## 📱 SCREEN 6: RAISE AMOUNT SELECTOR

### **Layout (Bottom Sheet Modal)**

```
[Overlay darken screen 60%]

┌─────────────────────────────────┐
│ ─────                           │ Handle 40x4px
│                                 │
│ Select Raise Amount             │ H2, White, centered
│                                 │ 20px spacing
│ Pot: $125 • Min: $25 • Max: $500│ Body/Small, Gray/400
│                                 │ 24px spacing
│ ┌───────────────────────────┐   │
│ │        $50                │   │ Amount display
│ └───────────────────────────┘   │ 80px height
│                                 │ 16px spacing
│ [━━━━━━●━━━━━━━━━━━━━━━━━]      │ Slider 8px height
│                                 │ 24px spacing
│ [$25]  [Pot]  [2x]  [All-In]   │ Quick amounts
│                                 │ 40px height each
│                                 │ 24px spacing
│ [1] [2] [3]                     │ Number pad
│ [4] [5] [6]                     │ 64px height each
│ [7] [8] [9]                     │ 16px spacing
│ [.] [0] [⌫]                    │
│                                 │ 24px spacing
│ ┌───────────────────────────┐   │
│ │   🚀 RAISE $50            │   │ Confirm button
│ └───────────────────────────┘   │ 56px height
│                                 │ 24px bottom + safe area
└─────────────────────────────────┘
```

### **Composants:**

**Bottom Sheet:**
```
Width: 100%
Max Height: 90vh
Background: Gray/900
Border: 4px, Purple/500 (top only)
Radius: Radius/XL (top corners only)
Shadow: Shadow/XL upward
Padding: 24px
Safe area bottom

Handle (drag indicator):
- Width: 40px
- Height: 4px
- Background: Gray/700
- Radius: Radius/Full
- Position: Top center, 12px from top
- Draggable (swipe down to close)
```

**Amount Display:**
```
Container: Full width
Height: 80px
Background: Gray/800
Border: 2px, Purple/500
Radius: Radius/Large (16px)
Padding: 16px

Content:
- Dollar sign: H1, Gray/400, left
- Amount: Display/Large, White, center
- Live update as user types/slides
```

**Slider:**
```
Track:
- Width: Full
- Height: 8px
- Background: Gray/700
- Radius: Radius/Full

Fill:
- Background: Gradient Primary
- Radius: Radius/Full

Thumb:
- Size: 32x32px
- Background: White
- Border: 4px, Purple/500
- Shadow: Shadow/Medium
- Radius: Full
- Draggable

Labels:
- Min value: Caption, Gray/500, left below
- Max value: Caption, Gray/500, right below
```

**Quick Amount Buttons:**
```
Container: Grid 4 columns
Gap: 8px

Button:
- Width: Calculated (25% - 6px)
- Height: 40px
- Background: Gray/800
- Border: 2px, Gray/700
- Radius: Radius/Medium
- Text: Label/Medium, White

States:
- Default
- Active (border Purple/500)
- Pressed

Amounts:
- $25 (Min)
- Pot (Current pot size)
- 2x Pot
- All-In (Max stack)
```

**Number Pad:**
```
Container: Grid 3 columns
Gap: 16px

Button:
- Width: Calculated (33.33% - 11px)
- Height: 64px
- Background: Gray/800
- Border: 2px, Gray/700
- Radius: Radius/Medium
- Text: H2, White

States:
- Default
- Pressed (bg Gray/700, scale 0.95)

Special buttons:
- Decimal point: Bottom left
- Zero: Bottom center
- Delete: Bottom right, icon ⌫
```

**Confirm Button:**
```
Container: Full width
Height: 56px
Background: Gradient Primary (Purple → Pink)
Radius: Radius/Large
Shadow: Shadow/Large + Glow/Purple
Text: H2, White, "🚀 RAISE $XX"
Dynamic amount in text

States:
- Default (with glow)
- Pressed
- Disabled (if amount invalid)
```

---

**[CONTINUÉ DANS PARTIE 2...]**

Ce document fait 3000+ lignes. Dois-je continuer avec les 4 autres screens (NFT Marketplace, Wallet, AI Training, Profile) avec le même niveau de détail ? 🎨
