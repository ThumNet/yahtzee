// Game Constants
export const NUM_DICE = 5;
export const MAX_ROLLS = 3;
export const TOTAL_ROUNDS = 13;
export const UPPER_BONUS_THRESHOLD = 63;
export const UPPER_BONUS_POINTS = 35;
export const YAHTZEE_BONUS_POINTS = 100;

// Layout
export const WIDE_SCREEN_BREAKPOINT = 768;

// Scoring Values
export const FULL_HOUSE_POINTS = 25;
export const SMALL_STRAIGHT_POINTS = 30;
export const LARGE_STRAIGHT_POINTS = 40;
export const YAHTZEE_POINTS = 50;

// Neon/Arcade Theme Colors
export const Colors = {
  // Primary neon colors
  primary: '#00f0ff',        // Cyan neon
  primaryDark: '#00c4cc',
  secondary: '#ff00ff',      // Magenta neon
  accent: '#ffff00',         // Yellow neon
  
  // Status colors
  success: '#00ff88',        // Green neon
  warning: '#ffaa00',        // Orange neon
  error: '#ff3366',          // Pink-red neon
  
  // Backgrounds
  background: '#0a0a1a',     // Deep dark blue-black
  surface: '#12122a',        // Slightly lighter
  surfaceLight: '#1a1a3a',   // Card backgrounds
  
  // Text
  text: '#ffffff',
  textSecondary: '#8888aa',
  textGlow: '#00f0ff',
  
  // Borders
  border: '#2a2a4a',
  borderGlow: '#00f0ff',
  
  // Dice
  diceBackground: '#1a1a3a',
  diceBorder: '#00f0ff',
  diceDots: '#ffffff',
  diceHeld: '#2a1a4a',
  diceHeldBorder: '#ff00ff',
  diceGlow: '#00f0ff',
  diceHeldGlow: '#ff00ff',
  
  // Scorecard
  rowSelectable: '#00f0ff15',
  rowSelectableBorder: '#00f0ff',
  rowBonus: '#ffaa0020',
  rowTotal: '#1a1a3a',
  
  // Gradients (for reference)
  gradientStart: '#0a0a1a',
  gradientEnd: '#1a0a2a',
};

// Glow/Shadow effects
export const Glow = {
  cyan: {
    shadowColor: '#00f0ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  magenta: {
    shadowColor: '#ff00ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  yellow: {
    shadowColor: '#ffff00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  green: {
    shadowColor: '#00ff88',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  subtle: {
    shadowColor: '#00f0ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
};

// Layout
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  title: 48,
  hero: 64,
};
