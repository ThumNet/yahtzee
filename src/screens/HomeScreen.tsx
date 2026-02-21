import React, { useEffect, useState } from 'react';
import { Logo } from '../components/Logo';
import { KeyboardHelpModal } from '../components/KeyboardHelpModal';
import { Colors, Spacing, FontSize, BorderRadius } from '../utils/constants';
import { loadHighScores } from '../utils/storage';

interface HomeScreenProps {
  onStartGame: () => void;
}

interface NeonButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  focused?: boolean;
}

function NeonButton({ label, onClick, variant = 'secondary', focused = false }: NeonButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const isPrimary = variant === 'primary';
  const color = isPrimary ? Colors.success : Colors.border;
  const hoverColor = isPrimary ? Colors.success : Colors.primary;
  const isActive = hovered || focused;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        backgroundColor: pressed
          ? (isPrimary ? Colors.success + '30' : Colors.primary + '20')
          : isActive
          ? (isPrimary ? Colors.success + '15' : Colors.primary + '10')
          : 'transparent',
        paddingTop: isPrimary ? Spacing.lg : Spacing.md,
        paddingBottom: isPrimary ? Spacing.lg : Spacing.md,
        borderRadius: isPrimary ? BorderRadius.xl : BorderRadius.lg,
        border: `${isPrimary ? 2 : 1}px solid ${isActive ? hoverColor : color}`,
        boxShadow: isPrimary
          ? `0 0 ${isActive ? 15 : 10}px ${Colors.success}`
          : focused ? `0 0 8px ${Colors.primary}` : 'none',
        cursor: 'pointer',
        transform: pressed ? 'scale(0.98)' : 'scale(1)',
        transition: 'all 0.15s',
        width: '100%',
        outline: 'none',
      }}
    >
      <span style={{
        color: isPrimary ? Colors.success : (focused ? Colors.primary : Colors.textSecondary),
        fontSize: isPrimary ? FontSize.xxl : FontSize.sm,
        fontWeight: isPrimary ? 'bold' : '600',
        letterSpacing: isPrimary ? 6 : 2,
        textShadow: isPrimary ? `0 0 10px ${Colors.success}` : focused ? `0 0 6px ${Colors.primary}` : 'none',
      }}>
        {label}
      </span>
    </button>
  );
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

  useEffect(() => {
    if (showKeyboardHelp) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex(i => (i + 1) % MENU_ITEMS.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex(i => (i - 1 + MENU_ITEMS.length) % MENU_ITEMS.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleMenuAction(MENU_ITEMS[focusedIndex]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showKeyboardHelp, focusedIndex]);

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
