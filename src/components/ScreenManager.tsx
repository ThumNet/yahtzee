import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { Colors } from '../utils/constants';

interface ScreenManagerProps {
  screenKey: string;
  children: ReactNode;
  duration?: number;
}

export function ScreenManager({ screenKey, children, duration = 300 }: ScreenManagerProps) {
  const [currentScreen, setCurrentScreen] = useState<ReactNode>(children);
  const [previousScreen, setPreviousScreen] = useState<ReactNode>(null);
  const [progress, setProgress] = useState(1);
  const prevKeyRef = useRef(screenKey);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (screenKey !== prevKeyRef.current) {
      setPreviousScreen(currentScreen);
      setCurrentScreen(children);
      setProgress(0);
      startTimeRef.current = null;

      const animate = (time: number) => {
        if (startTimeRef.current === null) startTimeRef.current = time;
        const elapsed = time - startTimeRef.current;
        const p = Math.min(elapsed / duration, 1);
        // ease out cubic
        const eased = 1 - Math.pow(1 - p, 3);
        setProgress(eased);
        if (p < 1) {
          animFrameRef.current = requestAnimationFrame(animate);
        } else {
          setPreviousScreen(null);
        }
      };
      animFrameRef.current = requestAnimationFrame(animate);
      prevKeyRef.current = screenKey;
    } else {
      setCurrentScreen(children);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [screenKey, children, duration]);

  const newScale = 0.85 + 0.15 * progress;
  const oldScale = 1 + 0.1 * progress;
  const newOpacity = progress;
  const oldOpacity = 1 - progress;

  return (
    <div style={{
      flex: 1,
      position: 'relative',
      backgroundColor: Colors.background,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
    }}>
      {previousScreen && (
        <div style={{
          position: 'absolute',
          inset: 0,
          opacity: oldOpacity,
          transform: `scale(${oldScale})`,
          pointerEvents: 'none',
        }}>
          {previousScreen}
        </div>
      )}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: newOpacity,
        transform: `scale(${newScale})`,
      }}>
        {currentScreen}
      </div>
    </div>
  );
}
