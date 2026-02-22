import React, { useState } from 'react';
import { Colors, FontSize } from '../utils/constants';

export function HelpButton({ onClick }: { onClick: () => void }) {
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
        width: 32,
        height: 32,
        border: `1px solid ${Colors.primary}`,
        borderRadius: 16,
        backgroundColor: pressed ? Colors.primary + '40' : hovered ? Colors.primary + '20' : 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: hovered ? `0 0 5px ${Colors.primary}` : 'none',
        transform: pressed ? 'scale(0.95)' : 'scale(1)',
        transition: 'all 0.1s',
      }}
    >
      <span style={{ color: Colors.primary, fontSize: FontSize.md, fontWeight: 'bold' }}>?</span>
    </button>
  );
}
