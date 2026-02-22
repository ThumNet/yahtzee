import React, { useState } from 'react';
import { Colors, Spacing, FontSize, BorderRadius } from '../utils/constants';

export interface HeaderButtonProps {
  label: string;
  onClick: () => void;
  color?: string;
}

export function HeaderButton({ label, onClick, color = Colors.textSecondary }: HeaderButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        padding: Spacing.sm,
        border: `1px solid ${hovered ? (color === Colors.error ? Colors.error : Colors.primary) : color}`,
        borderRadius: BorderRadius.md,
        backgroundColor: pressed ? (color + '40') : hovered ? (color + '20') : 'transparent',
        cursor: 'pointer',
        transform: pressed ? 'scale(0.95)' : 'scale(1)',
        transition: 'all 0.1s',
      }}
    >
      <span style={{ color, fontSize: FontSize.xs, fontWeight: 'bold', letterSpacing: 1 }}>
        {label}
      </span>
    </button>
  );
}
