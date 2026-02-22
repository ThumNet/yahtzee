import React, { useEffect, useRef, useState } from 'react';import { Confetti } from '../components/Confetti';
import { NeonButton } from '../components/NeonButton';
import { Colors, Spacing, FontSize, BorderRadius } from '../utils/constants';
import { loadHighScores } from '../utils/storage';


interface ResultsScreenProps {
  score: number;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export function ResultsScreen({ score, onPlayAgain, onGoHome }: ResultsScreenProps) {
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [scale, setScale] = useState(0.5);
  const [displayScore, setDisplayScore] = useState(0);
  const [glowIntensity, setGlowIntensity] = useState(0.5);
  const animFrameRef = useRef<number | null>(null);
  const glowFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const loadScores = async () => {
      const scores = await loadHighScores();
      const currentHighScore = scores.length > 0 ? scores[0].score : 0;
      setHighScore(currentHighScore);
      if (score > currentHighScore) {
        setIsNewHighScore(true);
        setTimeout(() => setShowConfetti(true), 500);
      }
    };
    loadScores();
  }, [score]);

  useEffect(() => {
    const duration = 1500;
    const animate = (time: number) => {
      if (startTimeRef.current === null) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 2);
      setScale(0.5 + 0.5 * eased);
      setDisplayScore(Math.round(score * eased));
      if (p < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };
    animFrameRef.current = requestAnimationFrame(animate);

    // Continuous glow pulse
    let glowStart: number | null = null;
    const glowAnimate = (time: number) => {
      if (glowStart === null) glowStart = time;
      const t = ((time - glowStart) % 3000) / 3000;
      const glow = 0.5 + 0.5 * Math.sin(t * Math.PI * 2);
      setGlowIntensity(glow);
      glowFrameRef.current = requestAnimationFrame(glowAnimate);
    };
    setTimeout(() => {
      glowFrameRef.current = requestAnimationFrame(glowAnimate);
    }, duration);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (glowFrameRef.current) cancelAnimationFrame(glowFrameRef.current);
    };
  }, [score]);

  const getMessage = () => {
    if (isNewHighScore) return { text: 'NEW HIGH SCORE!', color: Colors.accent };
    if (score >= 300) return { text: 'LEGENDARY!', color: Colors.accent };
    if (score >= 250) return { text: 'AMAZING!', color: Colors.success };
    if (score >= 200) return { text: 'GREAT GAME!', color: Colors.primary };
    if (score >= 150) return { text: 'WELL DONE!', color: Colors.primary };
    if (score >= 100) return { text: 'GOOD EFFORT!', color: Colors.secondary };
    return { text: 'KEEP TRYING!', color: Colors.textSecondary };
  };

  const message = getMessage();
  const glowRadius = 10 + 15 * glowIntensity;

  return (
    <div style={{
      flex: 1,
      backgroundColor: Colors.background,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
    }}>
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
      }}>
        <span style={{
          fontSize: FontSize.xxl,
          fontWeight: 'bold',
          color: Colors.textSecondary,
          marginBottom: Spacing.xl,
          letterSpacing: 6,
          display: 'block',
        }}>
          GAME OVER
        </span>

        <div style={{
          backgroundColor: Colors.surface,
          borderRadius: BorderRadius.xl,
          padding: Spacing.xxl,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: Spacing.xxl,
          minWidth: 280,
          border: `2px solid ${Colors.primary}`,
          boxShadow: `0 0 ${glowRadius}px ${Colors.primary}`,
          transform: `scale(${scale})`,
          transition: scale < 1 ? 'none' : 'box-shadow 0.1s',
        }}>
          <span style={{
            fontSize: FontSize.xl,
            fontWeight: 'bold',
            marginBottom: Spacing.lg,
            letterSpacing: 3,
            color: message.color,
            textShadow: `0 0 10px ${message.color}`,
            display: 'block',
          }}>
            {message.text}
          </span>
          <span style={{ fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.sm, letterSpacing: 3, display: 'block' }}>
            FINAL SCORE
          </span>
          <span style={{
            fontSize: FontSize.jumbo,
            fontWeight: 'bold',
            color: Colors.text,
            textShadow: `0 0 15px ${Colors.primary}`,
            display: 'block',
          }}>
            {displayScore}
          </span>
          {!isNewHighScore && highScore > 0 && (
            <span style={{ marginTop: Spacing.md, fontSize: FontSize.sm, color: Colors.textSecondary, letterSpacing: 2, display: 'block' }}>
              HIGH SCORE: {highScore}
            </span>
          )}
        </div>

        <div style={{ width: '100%', maxWidth: 300, display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
          <NeonButton label="PLAY AGAIN" onClick={onPlayAgain} variant="primary" />
          <NeonButton label="HOME" onClick={onGoHome} />
        </div>
      </div>
    </div>
  );
}
