import React from 'react';
import { Die as DieType } from '../types';
import { Dice } from './Dice';
import { Spacing } from '../utils/constants';

interface DiceTrayProps {
  dice: DieType[];
  onToggleHold: (id: number) => void;
  disabled?: boolean;
  isRolling?: boolean;
  compact?: boolean;
}

export function DiceTray({ dice, onToggleHold, disabled = false, isRolling = false, compact = false }: DiceTrayProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: compact ? Spacing.sm : Spacing.md,
      paddingTop: compact ? Spacing.sm : Spacing.xl,
      paddingBottom: compact ? Spacing.sm : Spacing.xl,
      paddingLeft: Spacing.md,
      paddingRight: Spacing.md,
    }}>
      {dice.map((die) => (
        <Dice
          key={die.id}
          die={die}
          onToggleHold={onToggleHold}
          disabled={disabled}
          isRolling={isRolling}
          compact={compact}
        />
      ))}
    </div>
  );
}
