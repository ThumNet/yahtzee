import React, { useCallback, useEffect, useState } from 'react';
import { Logo } from '../components/Logo';
import { KeyboardHelpModal } from '../components/KeyboardHelpModal';
import { NeonButton } from '../components/NeonButton';
import { useKeyboard } from '../hooks/useKeyboard';
import { Colors, Spacing, FontSize, BorderRadius } from '../utils/constants';
import { loadHighScores } from '../utils/storage';

interface HomeScreenProps {
  onStartGame: () => void;
}

const MENU_ITEMS = ['PLAY', 'HOW TO PLAY', 'HIGH SCORES'] as const;
type MenuItem = typeof MENU_ITEMS[number];

export function HomeScreen({ onStartGame }: HomeScreenProps) {
  const [highScore, setHighScore] = useState<number | null>(null);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleMenuAction = (item: MenuItem) => {
    if (item === 'PLAY') onStartGame();
    else if (item === 'HOW TO PLAY') setShowKeyboardHelp(true);
  };

  useEffect(() => {
    const fetchHighScore = async () => {
      const scores = await loadHighScores();
      if (scores.length > 0) setHighScore(scores[0].score);
    };
    fetchHighScore();
  }, []);

  const handleKeyPress = useCallback((key: string) => {
    if (key === 'ArrowDown') {
      setFocusedIndex(i => (i + 1) % MENU_ITEMS.length);
    } else if (key === 'ArrowUp') {
      setFocusedIndex(i => (i - 1 + MENU_ITEMS.length) % MENU_ITEMS.length);
    } else if (key === 'Enter') {
      handleMenuAction(MENU_ITEMS[focusedIndex]);
    }
  }, [focusedIndex]);

  useKeyboard(handleKeyPress, !showKeyboardHelp);

  return (
    <div style={{
      flex: 1,
      backgroundColor: Colors.background,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
    }}>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
      }}>
        <div style={{ marginBottom: Spacing.xxl }}>
          <Logo size="small" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.lg }}>
          {[5, 3, 6, 2, 4].map((num, index) => (
            <div
              key={index}
              style={{
                width: index === 2 ? 60 : 50,
                height: index === 2 ? 60 : 50,
                backgroundColor: Colors.surface,
                borderRadius: BorderRadius.lg,
                border: `2px solid ${index === 2 ? Colors.accent : Colors.primary}`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: `0 0 5px ${index === 2 ? Colors.accent : Colors.primary}`,
              }}
            >
              <span style={{
                fontSize: index === 2 ? FontSize.xxl : FontSize.xl,
                fontWeight: 'bold',
                color: index === 2 ? Colors.accent : Colors.primary,
                textShadow: `0 0 6px ${index === 2 ? Colors.accent : Colors.primary}`,
              }}>
                {num}
              </span>
            </div>
          ))}
        </div>

        {highScore !== null && (
          <span style={{
            color: Colors.accent,
            fontSize: FontSize.md,
            fontWeight: 'bold',
            letterSpacing: 2,
            marginBottom: Spacing.xl,
            textShadow: `0 0 8px ${Colors.accent}`,
          }}>
            HIGH SCORE: {highScore}
          </span>
        )}

        <div style={{ width: '100%', maxWidth: 300, display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
          <NeonButton label="PLAY" onClick={onStartGame} variant="primary" focused={focusedIndex === 0} />
          <NeonButton label="HOW TO PLAY" onClick={() => setShowKeyboardHelp(true)} focused={focusedIndex === 1} />
          <NeonButton label="HIGH SCORES" onClick={() => {}} focused={focusedIndex === 2} />
        </div>
      </div>

      <span style={{
        position: 'absolute',
        bottom: Spacing.xxl,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: FontSize.xs,
        color: Colors.textSecondary,
        letterSpacing: 4,
      }}>
        USE ARROW KEYS TO NAVIGATE, ENTER TO SELECT
      </span>

      <KeyboardHelpModal visible={showKeyboardHelp} onClose={() => setShowKeyboardHelp(false)} />
    </div>
  );
}
