import React, { useEffect, useRef, useState } from 'react';
import { Colors } from '../utils/constants';

interface ScorePopupProps {
  score: number;
  visible: boolean;
  onComplete?: () => void;
  topPercent?: number;
}

export function ScorePopup({ score, visible, onComplete, topPercent = 40 }: ScorePopupProps) {
  const [animState, setAnimState] = useState<'hidden' | 'entering' | 'visible' | 'exiting'>('hidden');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible && score > 0) {
      setAnimState('entering');
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setAnimState('exiting');
        timerRef.current = setTimeout(() => {
          setAnimState('hidden');
          onComplete?.();
        }, 400);
      }, 500);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, score]);

  if (animState === 'hidden' || score === 0) return null;

  const opacity = animState === 'exiting' ? 0 : 1;
  const transform = animState === 'entering' ? 'translateY(0) scale(1.2)' :
                    animState === 'visible' ? 'translateY(-20px) scale(1)' :
                    'translateY(-60px) scale(1)';

  return (
    <div
      style={{
        position: 'absolute',
        top: `${topPercent}%`,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 100,
        pointerEvents: 'none',
        opacity,
        transform,
        transition: animState === 'exiting' ? 'opacity 0.4s ease, transform 0.4s ease' : 'transform 0.3s ease',
      }}
    >
      <span style={{
        fontSize: 48,
        fontWeight: 'bold',
        color: Colors.success,
        textShadow: `0 0 20px ${Colors.success}`,
      }}>
        +{score}
      </span>
    </div>
  );
}
