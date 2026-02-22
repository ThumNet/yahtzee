// Dice Types
export interface Die {
  id: number;
  value: number;
  isHeld: boolean;
}

// Scoring Categories
export type UpperCategory = 'ones' | 'twos' | 'threes' | 'fours' | 'fives' | 'sixes';
export type LowerCategory = 
  | 'threeOfAKind'
  | 'fourOfAKind'
  | 'fullHouse'
  | 'smallStraight'
  | 'largeStraight'
  | 'yahtzee'
  | 'chance';

export type ScoreCategory = UpperCategory | LowerCategory;

// Scorecard
export type Scorecard = {
  [K in ScoreCategory]: number | null;
};

// Game State
export interface GameState {
  dice: Die[];
  rollsLeft: number;
  currentRound: number;
  scorecard: Scorecard;
  yahtzeeBonus: number;
  isGameOver: boolean;
}

// Game Settings
export interface GameSettings {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
}

// High Score Entry
export interface HighScore {
  score: number;
  date: string;
  playerName: string;
}

// Score display info
export interface ScoreCategoryInfo {
  key: ScoreCategory;
  label: string;
  description: string;
}

export const UPPER_CATEGORIES: ScoreCategoryInfo[] = [
  { key: 'ones', label: 'Ones', description: 'Sum of all ones' },
  { key: 'twos', label: 'Twos', description: 'Sum of all twos' },
  { key: 'threes', label: 'Threes', description: 'Sum of all threes' },
  { key: 'fours', label: 'Fours', description: 'Sum of all fours' },
  { key: 'fives', label: 'Fives', description: 'Sum of all fives' },
  { key: 'sixes', label: 'Sixes', description: 'Sum of all sixes' },
];

export const LOWER_CATEGORIES: ScoreCategoryInfo[] = [
  { key: 'threeOfAKind', label: 'Three of a Kind', description: 'Sum of all dice' },
  { key: 'fourOfAKind', label: 'Four of a Kind', description: 'Sum of all dice' },
  { key: 'fullHouse', label: 'Full House', description: '25 points' },
  { key: 'smallStraight', label: 'Small Straight', description: '30 points' },
  { key: 'largeStraight', label: 'Large Straight', description: '40 points' },
  { key: 'yahtzee', label: 'Yahtzee', description: '50 points' },
  { key: 'chance', label: 'Chance', description: 'Sum of all dice' },
];

export const ALL_CATEGORIES: ScoreCategory[] = [
  ...UPPER_CATEGORIES.map(c => c.key),
  ...LOWER_CATEGORIES.map(c => c.key),
];
