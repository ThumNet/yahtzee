import { Die, ScoreCategory, Scorecard, UPPER_CATEGORIES, LOWER_CATEGORIES } from '../types';
import {
  FULL_HOUSE_POINTS,
  SMALL_STRAIGHT_POINTS,
  LARGE_STRAIGHT_POINTS,
  YAHTZEE_POINTS,
  UPPER_BONUS_THRESHOLD,
  UPPER_BONUS_POINTS,
} from './constants';

// Get counts of each die value
function getDiceCounts(dice: Die[]): Map<number, number> {
  const counts = new Map<number, number>();
  dice.forEach((die) => {
    counts.set(die.value, (counts.get(die.value) || 0) + 1);
  });
  return counts;
}

// Sum all dice
function sumAllDice(dice: Die[]): number {
  return dice.reduce((sum, die) => sum + die.value, 0);
}

// Sum dice of specific value
function sumOfValue(dice: Die[], value: number): number {
  return dice.filter((die) => die.value === value).reduce((sum, die) => sum + die.value, 0);
}

// Check for n of a kind
function hasNOfAKind(dice: Die[], n: number): boolean {
  const counts = getDiceCounts(dice);
  return Array.from(counts.values()).some((count) => count >= n);
}

// Check for full house (3 of one kind + 2 of another)
function isFullHouse(dice: Die[]): boolean {
  const counts = getDiceCounts(dice);
  const values = Array.from(counts.values());
  return values.includes(3) && values.includes(2);
}

// Check for small straight (4 consecutive)
function isSmallStraight(dice: Die[]): boolean {
  const values = new Set(dice.map((die) => die.value));
  const straights = [
    [1, 2, 3, 4],
    [2, 3, 4, 5],
    [3, 4, 5, 6],
  ];
  return straights.some((straight) => straight.every((v) => values.has(v)));
}

// Check for large straight (5 consecutive)
function isLargeStraight(dice: Die[]): boolean {
  const values = [...new Set(dice.map((die) => die.value))].sort();
  if (values.length !== 5) return false;
  const straights = [
    [1, 2, 3, 4, 5],
    [2, 3, 4, 5, 6],
  ];
  return straights.some((straight) => straight.every((v, i) => values[i] === v));
}

// Check for yahtzee (5 of a kind)
export function isYahtzee(dice: Die[]): boolean {
  return hasNOfAKind(dice, 5);
}

// Calculate potential score for a category
export function calculatePotentialScore(dice: Die[], category: ScoreCategory): number {
  switch (category) {
    // Upper section
    case 'ones':
      return sumOfValue(dice, 1);
    case 'twos':
      return sumOfValue(dice, 2);
    case 'threes':
      return sumOfValue(dice, 3);
    case 'fours':
      return sumOfValue(dice, 4);
    case 'fives':
      return sumOfValue(dice, 5);
    case 'sixes':
      return sumOfValue(dice, 6);

    // Lower section
    case 'threeOfAKind':
      return hasNOfAKind(dice, 3) ? sumAllDice(dice) : 0;
    case 'fourOfAKind':
      return hasNOfAKind(dice, 4) ? sumAllDice(dice) : 0;
    case 'fullHouse':
      return isFullHouse(dice) ? FULL_HOUSE_POINTS : 0;
    case 'smallStraight':
      return isSmallStraight(dice) ? SMALL_STRAIGHT_POINTS : 0;
    case 'largeStraight':
      return isLargeStraight(dice) ? LARGE_STRAIGHT_POINTS : 0;
    case 'yahtzee':
      return isYahtzee(dice) ? YAHTZEE_POINTS : 0;
    case 'chance':
      return sumAllDice(dice);

    default:
      return 0;
  }
}

// Calculate upper section total
export function calculateUpperTotal(scorecard: Scorecard): number {
  const upperCategories = UPPER_CATEGORIES.map(c => c.key);
  return upperCategories.reduce((sum, cat) => sum + (scorecard[cat] || 0), 0);
}

// Calculate upper section bonus
export function calculateUpperBonus(scorecard: Scorecard): number {
  return calculateUpperTotal(scorecard) >= UPPER_BONUS_THRESHOLD ? UPPER_BONUS_POINTS : 0;
}

// Calculate lower section total
export function calculateLowerTotal(scorecard: Scorecard): number {
  const lowerCategories = LOWER_CATEGORIES.map(c => c.key);
  return lowerCategories.reduce((sum, cat) => sum + (scorecard[cat] || 0), 0);
}

// Calculate grand total
export function calculateGrandTotal(scorecard: Scorecard, yahtzeeBonus: number = 0): number {
  return (
    calculateUpperTotal(scorecard) +
    calculateUpperBonus(scorecard) +
    calculateLowerTotal(scorecard) +
    yahtzeeBonus
  );
}

// Check if scorecard is complete
export function isScorecardComplete(scorecard: Scorecard): boolean {
  return Object.values(scorecard).every((score) => score !== null);
}

// Create empty scorecard
export function createEmptyScorecard(): Scorecard {
  return {
    ones: null,
    twos: null,
    threes: null,
    fours: null,
    fives: null,
    sixes: null,
    threeOfAKind: null,
    fourOfAKind: null,
    fullHouse: null,
    smallStraight: null,
    largeStraight: null,
    yahtzee: null,
    chance: null,
  };
}
