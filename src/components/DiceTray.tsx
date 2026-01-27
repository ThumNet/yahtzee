import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Die as DieType } from '../types';
import { Dice } from './Dice';
import { Spacing } from '../utils/constants';

interface DiceTrayProps {
  dice: DieType[];
  onToggleHold: (id: number) => void;
  disabled?: boolean;
  isRolling?: boolean;
}

export function DiceTray({ dice, onToggleHold, disabled = false, isRolling = false }: DiceTrayProps) {
  return (
    <View style={styles.container}>
      {dice.map((die) => (
        <Dice
          key={die.id}
          die={die}
          onToggleHold={onToggleHold}
          disabled={disabled}
          isRolling={isRolling}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
});
