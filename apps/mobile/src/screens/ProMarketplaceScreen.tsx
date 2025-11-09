import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type ProMarketplaceScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ProMarketplace'>;
};

const PRO_COACHES = [
  {
    id: 'negreanu',
    name: 'Daniel Negreanu',
    style: 'TAG (Tight-Aggressive)',
    specialty: 'Reading opponents, Live tells',
    winnings: '$42M+',
    icon: '👨‍💼',
  },
  {
    id: 'ivey',
    name: 'Phil Ivey',
    style: 'LAG (Loose-Aggressive)',
    specialty: 'Aggression, Big pots',
    winnings: '$30M+',
    icon: '🎩',
  },
  {
    id: 'holz',
    name: 'Fedor Holz',
    style: 'GTO (Game Theory Optimal)',
    specialty: 'Mathematics, Tournament play',
    winnings: '$32M+',
    icon: '🧠',
  },
  {
    id: 'hellmuth',
    name: 'Phil Hellmuth',
    style: 'ABC (Straightforward)',
    specialty: 'Reading players, WSOP bracelets',
    winnings: '$24M+',
    icon: '👑',
  },
];

export default function ProMarketplaceScreen({ navigation }: ProMarketplaceScreenProps) {
  const handleSelectCoach = (coach: any) => {
    Alert.alert(
      coach.name,
      `Would you like ${coach.name} to coach your game?\n\nStyle: ${coach.style}\nSpecialty: ${coach.specialty}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Select Coach',
          onPress: () => {
            Alert.alert('Coach Selected!', `${coach.name} will now provide coaching during your games.`);
          },
        },
      ]
    );
  };

  return (
    <LinearGradient colors={['#047857', '#065f46']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Pro Coaches</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Learn from the legends. Select a coach to guide your gameplay.
      </Text>

      {/* Coaches List */}
      <ScrollView style={styles.coachesList}>
        {PRO_COACHES.map((coach) => (
          <TouchableOpacity
            key={coach.id}
            style={styles.coachCard}
            onPress={() => handleSelectCoach(coach)}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
              style={styles.coachGradient}
            >
              <View style={styles.coachIcon}>
                <Text style={styles.coachIconText}>{coach.icon}</Text>
              </View>
              <View style={styles.coachInfo}>
                <Text style={styles.coachName}>{coach.name}</Text>
                <Text style={styles.coachWinnings}>{coach.winnings}</Text>
                <Text style={styles.coachStyle}>{coach.style}</Text>
                <Text style={styles.coachSpecialty}>{coach.specialty}</Text>
              </View>
              <View style={styles.selectButton}>
                <Text style={styles.selectButtonText}>Select →</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 Coaches provide real-time advice during your games based on their legendary strategies!
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  backButton: {
    fontSize: 16,
    color: '#fbbf24',
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 50,
  },
  subtitle: {
    fontSize: 16,
    color: '#d1fae5',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  coachesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  coachCard: {
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  coachGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  coachIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  coachIconText: {
    fontSize: 36,
  },
  coachInfo: {
    flex: 1,
  },
  coachName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 3,
  },
  coachWinnings: {
    fontSize: 14,
    color: '#fbbf24',
    fontWeight: '600',
    marginBottom: 5,
  },
  coachStyle: {
    fontSize: 14,
    color: '#d1fae5',
    marginBottom: 2,
  },
  coachSpecialty: {
    fontSize: 12,
    color: '#94a3b8',
  },
  selectButton: {
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  selectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fbbf24',
  },
  infoBox: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 12,
    padding: 15,
    margin: 20,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  infoText: {
    fontSize: 14,
    color: '#d1fae5',
    textAlign: 'center',
  },
});
