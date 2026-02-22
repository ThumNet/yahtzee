import React, { useEffect, useState, useCallback } from 'react';
import { NeonButton } from '../components/NeonButton';
import { useKeyboard } from '../hooks/useKeyboard';
import { Colors, Spacing, FontSize, BorderRadius } from '../utils/constants';
import { loadHighScores } from '../utils/storage';
import { HighScore } from '../types';

interface HighScoresScreenProps {
  onGoHome: () => void;
}

function formatDate(isoString: string): { date: string; time: string } {
  try {
    const d = new Date(isoString);
    const date = d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const time = d.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return { date, time };
  } catch {
    return { date: '—', time: '' };
  }
}

export function HighScoresScreen({ onGoHome }: HighScoresScreenProps) {
  const [scores, setScores] = useState<HighScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    loadHighScores().then((data) => {
      if (!cancelled) {
        setScores(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  const handleKeyPress = useCallback((key: string) => {
    if (key === 'Escape') onGoHome();
  }, [onGoHome]);

  useKeyboard(handleKeyPress, true);

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
        alignItems: 'center',
        padding: Spacing.xl,
        overflowY: 'auto',
      }}>
        <h1 style={{
          fontSize: FontSize.xxl,
          fontWeight: 'bold',
          color: Colors.accent,
          textShadow: `0 0 12px ${Colors.accent}`,
          letterSpacing: 6,
          marginBottom: Spacing.xxl,
          marginTop: Spacing.xl,
        }}>
          HIGH SCORES
        </h1>

        <div style={{
          width: '100%',
          maxWidth: 480,
          marginBottom: Spacing.xxl,
        }}>
          {loading ? (
            <span style={{
              color: Colors.textSecondary,
              fontSize: FontSize.md,
              letterSpacing: 2,
              display: 'block',
              textAlign: 'center',
            }}>
              LOADING...
            </span>
          ) : scores.length === 0 ? (
            <span style={{
              color: Colors.textSecondary,
              fontSize: FontSize.md,
              letterSpacing: 2,
              display: 'block',
              textAlign: 'center',
            }}>
              NO SCORES YET
            </span>
          ) : (
            <div style={{
              backgroundColor: Colors.surface,
              borderRadius: BorderRadius.lg,
              border: `1px solid ${Colors.border}`,
              overflow: 'hidden',
            }}>
              {/* Header row */}
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: Spacing.xs,
                paddingBottom: Spacing.xs,
                paddingLeft: Spacing.md,
                paddingRight: Spacing.md,
                backgroundColor: Colors.surfaceLight,
                borderBottom: `1px solid ${Colors.border}`,
              }}>
                <span style={{ fontSize: FontSize.xs, color: Colors.primary, fontWeight: 'bold', letterSpacing: 2, textShadow: `0 0 6px ${Colors.primary}`, width: 32 }}>#</span>
                <span style={{ fontSize: FontSize.xs, color: Colors.primary, fontWeight: 'bold', letterSpacing: 2, textShadow: `0 0 6px ${Colors.primary}`, flex: 1, textAlign: 'center' }}>SCORE</span>
                <span style={{ fontSize: FontSize.xs, color: Colors.primary, fontWeight: 'bold', letterSpacing: 2, textShadow: `0 0 6px ${Colors.primary}`, flex: 1, textAlign: 'right' }}>DATE / TIME</span>
              </div>

              {scores.map((entry, index) => {
                const isTop = index === 0;
                const { date, time } = formatDate(entry.date);
                return (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: Spacing.sm,
                      paddingBottom: Spacing.sm,
                      paddingLeft: Spacing.md,
                      paddingRight: Spacing.md,
                      borderBottom: index < scores.length - 1 ? `1px solid ${Colors.border}` : 'none',
                      backgroundColor: isTop ? Colors.accent + '15' : 'transparent',
                    }}
                  >
                    <span style={{
                      fontSize: FontSize.sm,
                      fontWeight: 'bold',
                      color: isTop ? Colors.accent : Colors.textSecondary,
                      width: 32,
                    }}>
                      {index + 1}
                    </span>
                    <span style={{
                      fontSize: FontSize.lg,
                      fontWeight: 'bold',
                      color: isTop ? Colors.accent : Colors.text,
                      textShadow: isTop ? `0 0 8px ${Colors.accent}` : 'none',
                      flex: 1,
                      textAlign: 'center',
                    }}>
                      {entry.score}
                    </span>
                    <div style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                    }}>
                      <span style={{ fontSize: FontSize.sm, color: Colors.textSecondary }}>
                        {date}
                      </span>
                      <span style={{ fontSize: FontSize.xs, color: Colors.textSecondary, opacity: 0.7 }}>
                        {time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ width: '100%', maxWidth: 300 }}>
          <NeonButton label="HOME" onClick={onGoHome} />
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
        PRESS ESC TO GO HOME
      </span>
    </div>
  );
}
