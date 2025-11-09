# PokerMind Mobile App 🎰📱

React Native mobile app for PokerMind - AI-powered poker training on iOS and Android.

## Features

✅ **Complete Poker Gameplay**
- Full Texas Hold'em implementation
- 5 AI personalities (Nit, TAG, LAG, Maniac, Calling Station)
- Cash Game and Sit & Go modes
- Touch-optimized UI

✅ **Mobile-Optimized UI**
- Landscape-oriented poker table
- Touch-friendly action buttons
- Animated cards and chips
- Haptic feedback

✅ **Shared Game Engine**
- Uses same packages as web app
- Consistent game logic across platforms
- `@pokermind/poker-engine`
- `@pokermind/ai-engine`

✅ **Offline Support**
- AsyncStorage for local data
- Solo play vs AI (no internet required)
- User progress saved locally

## Tech Stack

- **React Native** with **Expo**
- **React Navigation** for routing
- **AsyncStorage** for local storage
- **Expo Linear Gradient** for UI effects
- **Expo Haptics** for touch feedback
- **Framer Motion** (React Native Reanimated)

## Installation

### Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- iOS: Xcode (for iOS development)
- Android: Android Studio + SDK

### Setup

```bash
# From the monorepo root
cd apps/mobile

# Install dependencies
npm install

# Start Expo dev server
npm start
```

### Run on Device/Emulator

```bash
# iOS (requires Mac)
npm run ios

# Android
npm run android

# Web (for testing)
npm run web
```

### Build for Production

```bash
# Android APK
npm run build:android

# iOS IPA
npm run build:ios
```

## Project Structure

```
apps/mobile/
├── App.tsx                 # Main app with navigation
├── app.json               # Expo configuration
├── src/
│   ├── screens/           # All screens
│   │   ├── HomeScreen.tsx
│   │   ├── LobbyScreen.tsx
│   │   ├── PlayScreen.tsx
│   │   ├── AchievementsScreen.tsx
│   │   └── ProMarketplaceScreen.tsx
│   ├── components/        # Reusable components
│   │   ├── Card.tsx
│   │   ├── PlayerSeat.tsx
│   │   ├── ActionButtons.tsx
│   │   └── MobilePokerTable.tsx
│   └── contexts/          # React contexts
│       └── AuthContext.tsx
└── assets/                # Images, icons
```

## Features Breakdown

### 🏠 Home Screen
- Login/Register
- User stats display
- Navigation to game modes

### 🎮 Lobby Screen
- Cash Game selection (4 stakes)
- Sit & Go tournaments (5 buy-ins)
- Buy-in validation

### 🃏 Play Screen
- Real-time poker gameplay
- AI opponents with personalities
- Touch-optimized action buttons
- Winner announcements

### 🏆 Achievements Screen
- Progress tracking
- Unlockable achievements
- User stats

### 👨‍🏫 Pro Coaches
- 4 legendary players
- Coach selection
- Strategy insights

## Development

### Adding New Features

1. **New Screen**: Add to `src/screens/` and update `App.tsx` navigation
2. **New Component**: Add to `src/components/`
3. **Shared Logic**: Import from `@pokermind/poker-engine` or `@pokermind/ai-engine`

### Testing

```bash
# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Test on physical device (via Expo Go)
npm start
# Scan QR code with Expo Go app
```

## Deployment

### iOS App Store

1. Configure `app.json` with proper bundle ID
2. Set up Apple Developer account
3. Build: `eas build --platform ios`
4. Submit via App Store Connect

### Google Play Store

1. Configure `app.json` with proper package name
2. Set up Google Play Console account
3. Build: `eas build --platform android`
4. Upload APK/AAB to Play Console

## Roadmap

- [ ] Multiplayer support (WebSocket)
- [ ] In-app purchases (chip packages)
- [ ] Push notifications
- [ ] Leaderboards
- [ ] Social features (friends, chat)
- [ ] Hand history replay
- [ ] Advanced statistics

## Notes

- **Landscape Mode**: App is designed for landscape orientation
- **Shared Packages**: Game logic is shared with web app
- **Offline First**: Works without internet for solo play
- **Multiplayer Coming**: Phase 2 will add real-time multiplayer

## License

Proprietary - All rights reserved
