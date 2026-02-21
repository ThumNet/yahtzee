import React, { useEffect } from 'react';
import { Colors, BorderRadius, Spacing, FontSize } from '../utils/constants';

interface KeyboardHelpModalProps {
  visible: boolean;
  onClose: () => void;
}

interface KeyBindingProps {
  keys: string[];
  description: string;
}

function KeyBinding({ keys, description }: KeyBindingProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.sm,
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', flexShrink: 0, marginRight: Spacing.md }}>
        {keys.map((key, index) => (
          <React.Fragment key={key}>
            <div style={{
              backgroundColor: Colors.surfaceLight,
              borderRadius: BorderRadius.sm,
              paddingTop: 4,
              paddingBottom: 4,
              paddingLeft: 8,
              paddingRight: 8,
              border: `1px solid ${Colors.border}`,
              borderBottomWidth: 3,
            }}>
              <span style={{ fontSize: FontSize.sm, fontWeight: 'bold', color: Colors.text }}>{key}</span>
            </div>
            {index < keys.length - 1 && (
              <span style={{ color: Colors.textSecondary, marginLeft: 4, marginRight: 4 }}>/</span>
            )}
          </React.Fragment>
        ))}
      </div>
      <span style={{ fontSize: FontSize.sm, color: Colors.text }}>{description}</span>
    </div>
  );
}

export function KeyboardHelpModal({ visible, onClose }: KeyboardHelpModalProps) {
  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
      }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        border: `2px solid ${Colors.primary}`,
        boxShadow: `0 0 20px ${Colors.primary}80`,
        minWidth: 320,
        maxWidth: 400,
      }}>
        <h2 style={{
          fontSize: FontSize.lg,
          fontWeight: 'bold',
          color: Colors.primary,
          textAlign: 'center',
          marginBottom: Spacing.lg,
          letterSpacing: 2,
          textShadow: `0 0 8px ${Colors.primary}`,
        }}>
          KEYBOARD CONTROLS
        </h2>

        <div style={{ marginBottom: Spacing.md }}>
          <span style={{ fontSize: FontSize.sm, fontWeight: 'bold', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: Spacing.sm }}>Dice</span>
          <KeyBinding keys={['Space']} description="Roll dice" />
          <KeyBinding keys={['1', '2', '3', '4', '5']} description="Toggle hold on die" />
        </div>

        <div style={{ marginBottom: Spacing.md }}>
          <span style={{ fontSize: FontSize.sm, fontWeight: 'bold', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: Spacing.sm }}>Scorecard</span>
          <KeyBinding keys={['↑', '↓']} description="Navigate categories" />
          <KeyBinding keys={['Enter']} description="Confirm selection" />
        </div>

        <div style={{ marginBottom: Spacing.md }}>
          <span style={{ fontSize: FontSize.sm, fontWeight: 'bold', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: Spacing.sm }}>Other</span>
          <KeyBinding keys={['M']} description="Toggle mute" />
        </div>

        <button
          onClick={onClose}
          style={{
            backgroundColor: Colors.primary + '20',
            borderRadius: BorderRadius.md,
            paddingTop: Spacing.sm,
            paddingBottom: Spacing.sm,
            paddingLeft: Spacing.lg,
            paddingRight: Spacing.lg,
            marginTop: Spacing.md,
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            border: `1px solid ${Colors.primary}`,
            cursor: 'pointer',
            color: Colors.primary,
            fontSize: FontSize.sm,
            fontWeight: 'bold',
            letterSpacing: 1,
          }}
        >
          CLOSE
        </button>
      </div>
    </div>
  );
}
