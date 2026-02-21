import { useState, useCallback, useRef } from 'react';
import { Die, GameState, ScoreCategory, Scorecard } from '../types';
import {
  calculatePotentialScore,
  createEmptyScorecard,
  isScorecardComplete,
  calculateGrandTotal,
} from '../utils/scoring';
import { NUM_DICE, MAX_ROLLS, YAHTZEE_BONUS_POINTS, YAHTZEE_POINTS } from '../utils/constants';

// Create initial dice
function createInitialDice(): Die[] {
  return Array.from({ length: NUM_DICE }, (_, i) => ({
    id: i,
    value: 1,
    isHeld: false,
  }));
}

// Create initial game state
function createInitialGameState(): GameState {
  return {
    dice: createInitialDice(),
    rollsLeft: MAX_ROLLS,
    currentRound: 1,
    scorecard: createEmptyScorecard(),
    yahtzeeBonus: 0,
    isGameOver: false,
  };
}

const ROLL_ANIMATION_DURATION = 400;

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [isRolling, setIsRolling] = useState(false);
  const rollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Roll the dice
  const rollDice = useCallback(() => {
    if (gameState.rollsLeft <= 0 || isRolling) return;

    setIsRolling(true);

    if (rollTimeoutRef.current) {
      clearTimeout(rollTimeoutRef.current);
    }

    setGameState((prev) => ({
      ...prev,
      dice: prev.dice.map((die) =>
        die.isHeld ? die : { ...die, value: Math.floor(Math.random() * 6) + 1 }
      ),
      rollsLeft: prev.rollsLeft - 1,
    }));

    rollTimeoutRef.current = setTimeout(() => {
      setIsRolling(false);
    }, ROLL_ANIMATION_DURATION);
  }, [gameState.rollsLeft, isRolling]);

  // Toggle hold on a die
  const toggleHold = useCallback((dieId: number) => {
    if (isRolling) return;

    setGameState((prev) => ({
      ...prev,
      dice: prev.dice.map((die) =>
        die.id === dieId ? { ...die, isHeld: !die.isHeld } : die
      ),
    }));
  }, [isRolling]);

  // Score a category
  const scoreCategory = useCallback((category: ScoreCategory) => {
    if (gameState.scorecard[category] !== null) return;
    if (gameState.rollsLeft === MAX_ROLLS) return;
    if (isRolling) return;

    const score = calculatePotentialScore(gameState.dice, category);

    let yahtzeeBonus = gameState.yahtzeeBonus;
    const isYahtzee = gameState.dice.every((d) => d.value === gameState.dice[0].value);

    if (isYahtzee && gameState.scorecard.yahtzee === YAHTZEE_POINTS) {
      yahtzeeBonus += YAHTZEE_BONUS_POINTS;
    }

    const newScorecard: Scorecard = {
      ...gameState.scorecard,
      [category]: score,
    };

    const isComplete = isScorecardComplete(newScorecard);
    const nextRound = isComplete ? gameState.currentRound : gameState.currentRound + 1;

    setGameState((prev) => ({
      ...prev,
      scorecard: newScorecard,
      yahtzeeBonus,
      currentRound: nextRound,
      rollsLeft: MAX_ROLLS,
      isGameOver: isComplete,
      dice: prev.dice.map((die) => ({ ...die, isHeld: false })),
    }));
  }, [gameState, isRolling]);

  // Get potential score for a category
  const getPotentialScore = useCallback(
    (category: ScoreCategory): number | null => {
      if (gameState.scorecard[category] !== null) return null;
      if (gameState.rollsLeft === MAX_ROLLS) return null;
      return calculatePotentialScore(gameState.dice, category);
    },
    [gameState.dice, gameState.rollsLeft, gameState.scorecard]
  );

  // Reset the game
  const resetGame = useCallback(() => {
    if (rollTimeoutRef.current) {
      clearTimeout(rollTimeoutRef.current);
    }
    setIsRolling(false);
    setGameState(createInitialGameState());
  }, []);

  const totalScore = calculateGrandTotal(gameState.scorecard, gameState.yahtzeeBonus);

  return {
    gameState,
    isRolling,
    rollDice,
    toggleHold,
    scoreCategory,
    getPotentialScore,
    resetGame,
    totalScore,
  };
}
