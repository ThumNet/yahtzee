import React, { useCallback } from 'react';
import { useKeyboard } from '../hooks/useKeyboard';
import { Colors, Spacing, FontSize, BorderRadius } from '../utils/constants';

interface QuitConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function QuitConfirmModal({ onConfirm, onCancel }: QuitConfirmModalProps) {
  const handleKeyPress = useCallback((key: string) => {
    if (key === 'Enter') onConfirm();
    if (key === 'Escape') onCancel();
  }, [onConfirm, onCancel]);
  useKeyboard(handleKeyPress, true);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
    }}>
      <div style={{
        backgroundColor: Colors.surface,
        border: `1px solid ${Colors.error}`,
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl,
        maxWidth: 320,
        width: '90%',
        boxShadow: `0 0 30px ${Colors.error}40`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: Spacing.lg,
      }}>
        <span style={{ fontSize: FontSize.xl, fontWeight: 'bold', color: Colors.text, letterSpacing: 2 }}>
          QUIT GAME?
        </span>
        <span style={{ fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center' }}>
          Your progress will be lost.
        </span>
        <div style={{ display: 'flex', gap: Spacing.md, width: '100%' }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: Spacing.md,
              backgroundColor: 'transparent',
              border: `1px solid ${Colors.border}`,
              borderRadius: BorderRadius.lg,
              color: Colors.textSecondary,
              fontSize: FontSize.sm,
              fontWeight: 'bold',
              letterSpacing: 2,
              cursor: 'pointer',
            }}
          >
            CANCEL
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: Spacing.md,
              backgroundColor: Colors.error + '20',
              border: `1px solid ${Colors.error}`,
              borderRadius: BorderRadius.lg,
              color: Colors.error,
              fontSize: FontSize.sm,
              fontWeight: 'bold',
              letterSpacing: 2,
              cursor: 'pointer',
              boxShadow: `0 0 10px ${Colors.error}40`,
            }}
          >
            QUIT
          </button>
        </div>
      </div>
    </div>
  );
}
