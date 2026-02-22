import React, { useState } from 'react';
import { Colors, Spacing, FontSize, BorderRadius } from '../utils/constants';

export interface NeonButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  focused?: boolean;
}

export function NeonButton({ label, onClick, variant = 'secondary', focused = false }: NeonButtonProps) {
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
