import React, { useEffect, useRef, useState, ReactNode, CSSProperties } from 'react';

interface ScreenTransitionProps {
  children: ReactNode;
  type?: 'fade' | 'slideUp' | 'slideLeft' | 'scale';
  duration?: number;
  style?: CSSProperties;
}

export function ScreenTransition({
  children,
  type = 'fade',
  duration = 300,
  style,
}: ScreenTransitionProps) {
  const [progress, setProgress] = useState(0);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (time: number) => {
      if (startTimeRef.current === null) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;
      const p = Math.min(elapsed / duration, 1);
      setProgress(p);
      if (p < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };
    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [duration]);

  const getStyle = (): CSSProperties => {
    switch (type) {
      case 'fade':
        return { opacity: progress };
      case 'slideUp':
        return {
          opacity: progress,
          transform: `translateY(${50 - 50 * progress}px)`,
        };
      case 'slideLeft':
        return {
          opacity: progress,
          transform: `translateX(${100 - 100 * progress}px)`,
        };
      case 'scale':
        return {
          opacity: progress,
          transform: `scale(${0.9 + 0.1 * progress})`,
        };
      default:
        return { opacity: progress };
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', ...style, ...getStyle() }}>
      {children}
    </div>
  );
}
