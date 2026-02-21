import React, { useEffect, useRef, useState } from 'react';
import { Logo } from '../components/Logo';
import { Colors } from '../utils/constants';

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(0.8);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Entrance animation over 800ms
    const enterDuration = 800;
    const animate = (time: number) => {
      if (startTimeRef.current === null) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;
      const p = Math.min(elapsed / enterDuration, 1);
      const eased = 1 - Math.pow(1 - p, 2); // ease out quad
      setOpacity(eased);
      setScale(0.8 + 0.2 * eased);
      if (p < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };
    animFrameRef.current = requestAnimationFrame(animate);

    // Auto-transition after 1200ms
    timerRef.current = setTimeout(() => {
      // Fade out
      const fadeStart = performance.now();
      const fadeDuration = 400;
      const fadeOut = (time: number) => {
        const elapsed = time - fadeStart;
        const p = Math.min(elapsed / fadeDuration, 1);
        setOpacity(1 - p);
        if (p < 1) {
          requestAnimationFrame(fadeOut);
        } else {
          onFinish();
        }
      };
      requestAnimationFrame(fadeOut);
    }, 1200);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div style={{
      flex: 1,
      backgroundColor: Colors.background,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
    }}>
      <div style={{
        opacity,
        transform: `scale(${scale})`,
        marginBottom: 60,
      }}>
        <Logo size="splash" />
      </div>
      <span style={{
        position: 'absolute',
        bottom: 80,
        color: Colors.textSecondary,
        fontSize: 12,
        letterSpacing: 6,
        opacity,
      }}>
        LOADING...
      </span>
    </div>
  );
}
