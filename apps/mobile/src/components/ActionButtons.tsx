import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface ActionButtonsProps {
  options: {
    canCheck: boolean;
    canCall: boolean;
    canRaise: boolean;
    canFold: boolean;
    callAmount: number;
    minRaise: number;
    maxRaise: number;
  };
  onAction: (action: 'fold' | 'check' | 'call' | 'raise', amount?: number) => void;
  pot: number;
}

export default function ActionButtons({ options, onAction, pot }: ActionButtonsProps) {
  const [raiseAmount, setRaiseAmount] = useState(options.minRaise);

  const handleAction = (action: 'fold' | 'check' | 'call' | 'raise', amount?: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onAction(action, amount);
  };

  return (
    <View style={styles.container}>
      {/* Raise Controls */}
      {options.canRaise && (
        <View style={styles.raiseContainer}>
          <View style={styles.raiseHeader}>
            <Text style={styles.raiseLabel}>Raise</Text>
            <Text style={styles.raiseAmount}>{raiseAmount}</Text>
          </View>

          <Slider
            style={styles.slider}
            minimumValue={options.minRaise}
            maximumValue={options.maxRaise}
            value={raiseAmount}
            onValueChange={(value) => setRaiseAmount(Math.floor(value))}
            minimumTrackTintColor="#fbbf24"
            maximumTrackTintColor="#374151"
            thumbTintColor="#fbbf24"
            step={options.minRaise < 100 ? 10 : 50}
          />

          {/* Quick Raise Buttons */}
          <View style={styles.quickRaiseContainer}>
            <TouchableOpacity
              style={styles.quickRaiseButton}
              onPress={() => setRaiseAmount(Math.min(pot, options.maxRaise))}
            >
              <Text style={styles.quickRaiseText}>Pot</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickRaiseButton}
              onPress={() => setRaiseAmount(Math.min(pot * 2, options.maxRaise))}
            >
              <Text style={styles.quickRaiseText}>2x Pot</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickRaiseButton}
              onPress={() => setRaiseAmount(options.maxRaise)}
            >
              <Text style={styles.quickRaiseText}>All-In</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        {/* Fold */}
        {options.canFold && (
          <TouchableOpacity
            style={[styles.actionButton, styles.foldButton]}
            onPress={() => handleAction('fold')}
          >
            <Text style={styles.actionButtonText}>Fold</Text>
          </TouchableOpacity>
        )}

        {/* Check */}
        {options.canCheck && (
          <TouchableOpacity
            style={[styles.actionButton, styles.checkButton]}
            onPress={() => handleAction('check')}
          >
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.buttonGradient}
            >
              <Text style={styles.actionButtonText}>Check</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Call */}
        {options.canCall && (
          <TouchableOpacity
            style={[styles.actionButton, styles.callButton]}
            onPress={() => handleAction('call', options.callAmount)}
          >
            <LinearGradient
              colors={['#3b82f6', '#2563eb']}
              style={styles.buttonGradient}
            >
              <Text style={styles.actionButtonText}>
                Call {options.callAmount}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Raise */}
        {options.canRaise && (
          <TouchableOpacity
            style={[styles.actionButton, styles.raiseButton]}
            onPress={() => handleAction('raise', raiseAmount)}
          >
            <LinearGradient
              colors={['#fbbf24', '#f59e0b']}
              style={styles.buttonGradient}
            >
              <Text style={[styles.actionButtonText, styles.raiseButtonText]}>
                Raise {raiseAmount}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  raiseContainer: {
    marginBottom: 15,
  },
  raiseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  raiseLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  raiseAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fbbf24',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  quickRaiseContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  quickRaiseButton: {
    flex: 1,
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  quickRaiseText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fbbf24',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    minHeight: 50,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  foldButton: {
    backgroundColor: '#dc2626',
  },
  checkButton: {
    backgroundColor: '#10b981',
  },
  callButton: {
    backgroundColor: '#3b82f6',
  },
  raiseButton: {
    backgroundColor: '#fbbf24',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  raiseButtonText: {
    color: '#1f2937',
  },
});
