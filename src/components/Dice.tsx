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
}

export function Dice({ die, onToggleHold, disabled = false, isRolling = false }: DiceProps) {
  const size = 64;
  const dotSize = 10;
  const inset = 6;

  const [rollKey, setRollKey] = useState(0);
  const [animDuration, setAnimDuration] = useState(400);
  const [spinDeg, setSpinDeg] = useState(360);
  const [displayValue, setDisplayValue] = useState(die.value);
  const [animating, setAnimating] = useState(false);
  const prevRollingRef = useRef(false);
  const flickerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isRolling && !prevRollingRef.current && !die.isHeld) {
      const duration = Math.floor(Math.random() * (DURATION_MAX - DURATION_MIN + 1)) + DURATION_MIN;
      const rotations = Math.round(Math.min(3, Math.max(1, duration / 300)));
      const direction = Math.random() < 0.5 ? 1 : -1;
      setAnimDuration(duration);
      setSpinDeg(direction * rotations * 360);
      setRollKey(k => k + 1);
      setAnimating(true);

      // Schedule flickering face values — interval slows as the die settles
      let elapsed = 0;
      const scheduleFlicker = (delay: number) => {
        flickerRef.current = setTimeout(() => {
          elapsed += delay;
          if (elapsed < duration - 80) {
            setDisplayValue(Math.floor(Math.random() * 6) + 1);
            const progress = elapsed / duration;
            const nextDelay = 50 + Math.floor(progress * progress * 180);
            scheduleFlicker(nextDelay);
          } else {
            setDisplayValue(die.value);
            setAnimating(false);
          }
        }, delay);
      };
      scheduleFlicker(50);

      // Safety: ensure animating is cleared even if flicker chain ends early
      animTimeoutRef.current = setTimeout(() => setAnimating(false), duration + 50);

      return () => {
        if (flickerRef.current) clearTimeout(flickerRef.current);
        if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      };
    }
    // Scoring or round reset — stop any in-progress animation immediately
    if (!isRolling) {
      if (flickerRef.current) clearTimeout(flickerRef.current);
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      setAnimating(false);
      setDisplayValue(die.value);
    }
    prevRollingRef.current = isRolling;
  }, [isRolling, die.isHeld, die.value]);

  const glowColor = die.isHeld ? Colors.diceHeldGlow : Colors.diceGlow;
  const borderColor = die.isHeld ? Colors.diceHeldBorder : Colors.diceBorder;
  const bg = die.isHeld ? Colors.diceHeld : Colors.diceBackground;

  const variantIndex = die.id % ROLL_VARIANTS.length;
  const animName = ROLL_VARIANTS[variantIndex];
  const shouldAnimate = animating && !die.isHeld;
  const dots = DOT_LAYOUT[displayValue] || [];

  return (
    <div
      key={shouldAnimate ? rollKey : 'static'}
      style={{
        animation: shouldAnimate ? `${animName} ${animDuration}ms ease-out` : 'none',
        '--spin': `${spinDeg}deg`,
        flexShrink: 0,
      } as React.CSSProperties}
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
