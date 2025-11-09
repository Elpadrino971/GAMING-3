import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/contexts/AuthContext';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import LobbyScreen from './src/screens/LobbyScreen';
import PlayScreen from './src/screens/PlayScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import ProMarketplaceScreen from './src/screens/ProMarketplaceScreen';

export type RootStackParamList = {
  Home: undefined;
  Lobby: undefined;
  Play: {
    gameMode: 'cash' | 'sng';
    buyIn: number;
    smallBlind: number;
    bigBlind: number;
  };
  Achievements: undefined;
  ProMarketplace: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: '#047857' },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Lobby" component={LobbyScreen} />
          <Stack.Screen name="Play" component={PlayScreen} />
          <Stack.Screen name="Achievements" component={AchievementsScreen} />
          <Stack.Screen name="ProMarketplace" component={ProMarketplaceScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="light" />
    </AuthProvider>
  );
}
