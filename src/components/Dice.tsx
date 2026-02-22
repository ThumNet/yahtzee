import React, { useEffect, useRef, useState } from 'react';
import { Die as DieType } from '../types';
import { Colors, BorderRadius } from '../utils/constants';

// Dot layout grid: [row, col] positions (0-2 index in a 3x3 grid)
const DOT_LAYOUT: Record<number, [number, number][]> = {
  1: [[1, 1]],
  2: [[0, 2], [2, 0]],
  3: [[0, 2], [1, 1], [2, 0]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
};

// Five distinct animation variants — each die (id 0–4) gets its own
const ROLL_VARIANTS = ['dice-roll-a', 'dice-roll-b', 'dice-roll-c', 'dice-roll-d', 'dice-roll-e'];
const DURATION_MIN = 250;
const DURATION_MAX = 700;

interface DiceProps {
  die: DieType;
  onToggleHold: (id: number) => void;
  disabled?: boolean;
  isRolling?: boolean;
  compact?: boolean;
}

export function Dice({ die, onToggleHold, disabled = false, isRolling = false, compact = false }: DiceProps) {
  const size = compact ? 48 : 64;
  const dotSize = compact ? 7 : 10;
  const inset = compact ? 5 : 6;
  const dots = DOT_LAYOUT[die.value] || [];
  const [rollKey, setRollKey] = useState(0);
  const [animDuration, setAnimDuration] = useState(400);
  const prevRollingRef = useRef(false);

  useEffect(() => {
    if (isRolling && !prevRollingRef.current && !die.isHeld) {
      setAnimDuration(Math.floor(Math.random() * (DURATION_MAX - DURATION_MIN + 1)) + DURATION_MIN);
      setRollKey(k => k + 1);
    }
    prevRollingRef.current = isRolling;
  }, [isRolling, die.isHeld]);

  const glowColor = die.isHeld ? Colors.diceHeldGlow : Colors.diceGlow;
  const borderColor = die.isHeld ? Colors.diceHeldBorder : Colors.diceBorder;
  const bg = die.isHeld ? Colors.diceHeld : Colors.diceBackground;

  const variantIndex = die.id % ROLL_VARIANTS.length;
  const animName = ROLL_VARIANTS[variantIndex];
  const shouldAnimate = rollKey > 0 && !die.isHeld;

  return (
    <div
      key={shouldAnimate ? rollKey : 'static'}
      style={{
        animation: shouldAnimate ? `${animName} ${animDuration}ms ease-in-out` : 'none',
        flexShrink: 0,
      }}
    >
      <button
        onClick={() => !disabled && onToggleHold(die.id)}
        disabled={disabled}
        style={{
          width: size,
          height: size,
          backgroundColor: bg,
          borderRadius: BorderRadius.lg,
          border: `2px solid ${borderColor}`,
          position: 'relative',
          cursor: disabled ? 'default' : 'pointer',
          padding: 0,
          boxShadow: `0 0 10px ${glowColor}`,
          transition: 'background-color 0.15s, border-color 0.15s, box-shadow 0.15s',
          display: 'block',
        }}
      >
        <div style={{
          position: 'absolute',
          inset,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
        }}>
          {dots.map(([row, col], index) => (
            <div
              key={index}
              style={{
                gridRow: row + 1,
                gridColumn: col + 1,
                width: dotSize,
                height: dotSize,
                borderRadius: '50%',
                backgroundColor: Colors.diceDots,
                boxShadow: `0 0 4px ${Colors.primary}`,
                alignSelf: 'center',
                justifySelf: 'center',
              }}
            />
          ))}
        </div>
      </button>
    </div>
  );
}
