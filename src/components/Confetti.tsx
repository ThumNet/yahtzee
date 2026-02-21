import React, { useEffect, useRef, useState } from 'react';
import { Colors } from '../utils/constants';

interface ConfettiPiece {
  id: number;
  startX: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  horizontalDrift: number;
}

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

const CONFETTI_COLORS = [
  Colors.primary,
  Colors.secondary,
  Colors.accent,
  Colors.success,
  '#ff6b6b',
  '#ffffff',
];

const NUM_PIECES = 50;

export function Confetti({ active, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const hasAnimated = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (active && !hasAnimated.current) {
      hasAnimated.current = true;

      const newPieces: ConfettiPiece[] = Array.from({ length: NUM_PIECES }, (_, i) => ({
        id: i,
        startX: Math.random() * 100, // percent
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 8 + Math.random() * 8,
        delay: Math.random() * 0.5,
        duration: 3 + Math.random() * 1.5,
        horizontalDrift: (Math.random() - 0.5) * 200,
      }));

      setPieces(newPieces);

      const maxDuration = 5000;
      timerRef.current = setTimeout(() => {
        setPieces([]);
        hasAnimated.current = false;
        onComplete?.();
      }, maxDuration);
    } else if (!active) {
      hasAnimated.current = false;
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [active]);

  if (pieces.length === 0) return null;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 1000,
      pointerEvents: 'none',
      overflow: 'hidden',
    }}>
      {pieces.map((piece) => (
        <div
          key={piece.id}
          style={{
            position: 'absolute',
            left: `${piece.startX}%`,
            top: -20,
            width: piece.size,
            height: piece.size * 0.6,
            backgroundColor: piece.color,
            borderRadius: 2,
            boxShadow: `0 0 4px ${piece.color}`,
            animation: `confetti-fall ${piece.duration}s ${piece.delay}s linear forwards`,
            '--drift': `${piece.horizontalDrift}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
