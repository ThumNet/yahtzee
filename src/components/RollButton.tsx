import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { Colors, BorderRadius, Spacing, FontSize, Glow } from '../utils/constants';

interface RollButtonProps {
  onRoll: () => void;
  rollsLeft: number;
  disabled?: boolean;
}

export function RollButton({ onRoll, rollsLeft, disabled = false }: RollButtonProps) {
  const isDisabled = disabled || rollsLeft <= 0;

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onRoll}
        disabled={isDisabled}
        style={({ hovered, pressed }) => [
          styles.button,
          isDisabled ? styles.buttonDisabled : styles.buttonActive,
          hovered && !isDisabled && styles.buttonHovered,
          pressed && !isDisabled && styles.buttonPressed,
        ]}
      >
        <Text style={[styles.buttonText, isDisabled && styles.buttonTextDisabled]}>
          ROLL
        </Text>
      </Pressable>
      <View style={styles.rollsContainer}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[
              styles.rollIndicator,
              i < rollsLeft ? styles.rollIndicatorActive : styles.rollIndicatorUsed,
            ]}
          />
        ))}
      </View>
      <Text style={styles.rollsText}>
        {rollsLeft} roll{rollsLeft !== 1 ? 's' : ''} left
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl + 16,
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
  },
  buttonActive: {
    backgroundColor: 'transparent',
    borderColor: Colors.primary,
    ...Glow.cyan,
  },
  buttonHovered: {
    backgroundColor: Colors.primary + '20',
    borderColor: Colors.primary,
    shadowRadius: 15,
  },
  buttonPressed: {
    backgroundColor: Colors.primary + '40',
    transform: [{ scale: 0.98 }],
  },
  buttonDisabled: {
    backgroundColor: 'transparent',
    borderColor: Colors.border,
  },
  buttonText: {
    color: Colors.primary,
    fontSize: FontSize.xl,
    fontWeight: 'bold',
    letterSpacing: 4,
    textShadowColor: Colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  buttonTextDisabled: {
    color: Colors.textSecondary,
    textShadowRadius: 0,
  },
  rollsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  rollIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
  },
  rollIndicatorActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 6,
  },
  rollIndicatorUsed: {
    backgroundColor: 'transparent',
    borderColor: Colors.border,
  },
  rollsText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
});
