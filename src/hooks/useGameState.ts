import { useState, useCallback, useRef } from 'react';
import { Die, GameState, ScoreCategory, Scorecard } from '../types';
import {
  calculatePotentialScore,
  createEmptyScorecard,
  isScorecardComplete,
  calculateGrandTotal,
  isYahtzee,
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
    // Cancel any in-flight roll animation so the new round starts clean
    if (rollTimeoutRef.current) {
      clearTimeout(rollTimeoutRef.current);
      rollTimeoutRef.current = null;
    }
    setIsRolling(false);

    setGameState((prev) => {
      if (prev.scorecard[category] !== null) return prev;
      if (prev.rollsLeft === MAX_ROLLS) return prev;

      const score = calculatePotentialScore(prev.dice, category);

      let yahtzeeBonus = prev.yahtzeeBonus;
      if (isYahtzee(prev.dice) && prev.scorecard.yahtzee === YAHTZEE_POINTS) {
        yahtzeeBonus += YAHTZEE_BONUS_POINTS;
      }

      const newScorecard: Scorecard = {
        ...prev.scorecard,
        [category]: score,
      };

      const isComplete = isScorecardComplete(newScorecard);
      const nextRound = isComplete ? prev.currentRound : prev.currentRound + 1;

      return {
        ...prev,
        scorecard: newScorecard,
        yahtzeeBonus,
        currentRound: nextRound,
        rollsLeft: MAX_ROLLS,
        isGameOver: isComplete,
        dice: prev.dice.map((die) => ({ ...die, isHeld: false })),
      };
    });
  }, []);

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

  // Dev only: force all dice to the same value and consume a roll
  const forceYahtzee = useCallback(() => {
    if (gameState.rollsLeft <= 0) return;
    if (rollTimeoutRef.current) clearTimeout(rollTimeoutRef.current);
    setIsRolling(true);
    const value = Math.floor(Math.random() * 6) + 1;
    setGameState((prev) => ({
      ...prev,
      dice: prev.dice.map((die) => ({ ...die, value, isHeld: false })),
      rollsLeft: prev.rollsLeft - 1,
    }));
    rollTimeoutRef.current = setTimeout(() => {
      setIsRolling(false);
    }, ROLL_ANIMATION_DURATION);
  }, [gameState.rollsLeft]);

  const totalScore = calculateGrandTotal(gameState.scorecard, gameState.yahtzeeBonus);

  return {
    gameState,
    isRolling,
    rollDice,
    toggleHold,
    scoreCategory,
    getPotentialScore,
    resetGame,
    forceYahtzee,
    totalScore,
  };
}
