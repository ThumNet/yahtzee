import React, { useState } from 'react';
import { Colors, BorderRadius, Spacing, FontSize } from '../utils/constants';

interface RollButtonProps {
  onRoll: () => void;
  rollsLeft: number;
  disabled?: boolean;
  compact?: boolean;
}

export function RollButton({ onRoll, rollsLeft, disabled = false, compact = false }: RollButtonProps) {
  const isDisabled = disabled || rollsLeft <= 0;
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const getBorderColor = () => {
    if (isDisabled) return Colors.border;
    return Colors.primary;
  };

  const getBackground = () => {
    if (isDisabled) return 'transparent';
    if (pressed) return Colors.primary + '40';
    if (hovered) return Colors.primary + '20';
    return 'transparent';
  };

  const getBoxShadow = () => {
    if (isDisabled) return 'none';
    if (hovered) return `0 0 15px ${Colors.primary}`;
    return `0 0 10px ${Colors.primary}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: compact ? Spacing.xs : Spacing.sm }}>
      <button
        onClick={onRoll}
        disabled={isDisabled}
        onMouseEnter={() => !isDisabled && setHovered(true)}
        onMouseLeave={() => { setHovered(false); setPressed(false); }}
        onMouseDown={() => !isDisabled && setPressed(true)}
        onMouseUp={() => setPressed(false)}
        style={{
          paddingTop: compact ? Spacing.sm : Spacing.md,
          paddingBottom: compact ? Spacing.sm : Spacing.md,
          paddingLeft: compact ? Spacing.xl : Spacing.xxl + 16,
          paddingRight: compact ? Spacing.xl : Spacing.xxl + 16,
          borderRadius: BorderRadius.xl,
          border: `2px solid ${getBorderColor()}`,
          backgroundColor: getBackground(),
          boxShadow: getBoxShadow(),
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          transform: pressed ? 'scale(0.98)' : 'scale(1)',
          transition: 'all 0.15s',
        }}
      >
        <span style={{
          color: isDisabled ? Colors.textSecondary : Colors.primary,
          fontSize: compact ? FontSize.md : FontSize.xl,
          fontWeight: 'bold',
          letterSpacing: 4,
          textShadow: isDisabled ? 'none' : `0 0 10px ${Colors.primary}`,
        }}>
          ROLL
        </span>
      </button>

      <div style={{ display: 'flex', flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.xs }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: compact ? 10 : 12,
              height: compact ? 10 : 12,
              borderRadius: compact ? 5 : 6,
              border: `2px solid ${i < rollsLeft ? Colors.primary : Colors.border}`,
              backgroundColor: i < rollsLeft ? Colors.primary : 'transparent',
              boxShadow: i < rollsLeft ? `0 0 6px ${Colors.primary}` : 'none',
            }}
          />
        ))}
      </div>

      <span style={{ fontSize: FontSize.xs, color: Colors.textSecondary, letterSpacing: 1 }}>
        {rollsLeft} roll{rollsLeft !== 1 ? 's' : ''} left
      </span>
    </div>
  );
}
