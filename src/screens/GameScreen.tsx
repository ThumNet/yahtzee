import React, { useCallback, useState, useRef, useEffect } from 'react';
import { DiceTray } from '../components/DiceTray';
import { RollButton } from '../components/RollButton';
import { Scorecard } from '../components/Scorecard';
import { ScorePopup } from '../components/ScorePopup';
import { Confetti } from '../components/Confetti';
import { KeyboardHelpModal } from '../components/KeyboardHelpModal';
import { useGameState } from '../hooks/useGameState';
import { useHaptics } from '../hooks/useHaptics';
import { useSound } from '../hooks/useSound';
import { useKeyboard } from '../hooks/useKeyboard';
import { useWindowDimensions } from '../hooks/useWindowDimensions';
import { useSoundContext } from '../contexts/SoundContext';
import { Colors, Spacing, FontSize, BorderRadius } from '../utils/constants';
import { MAX_ROLLS, TOTAL_ROUNDS, YAHTZEE_BONUS_POINTS, YAHTZEE_POINTS } from '../utils/constants';
import { ScoreCategory, ALL_CATEGORIES } from '../types';
import { calculatePotentialScore } from '../utils/scoring';

interface GameScreenProps {
  onGameOver: (score: number) => void;
  onQuit: () => void;
}

const WIDE_SCREEN_BREAKPOINT = 768;

interface HeaderButtonProps {
  label: string;
  onClick: () => void;
  color?: string;
}

function HeaderButton({ label, onClick, color = Colors.textSecondary }: HeaderButtonProps) {
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

function QuitConfirmModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter') { e.preventDefault(); onConfirm(); }
      if (e.key === 'Escape') { e.preventDefault(); onCancel(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onConfirm, onCancel]);
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

function HelpButton({ onClick }: { onClick: () => void }) {
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

export function GameScreen({ onGameOver, onQuit }: GameScreenProps) {
  const { width } = useWindowDimensions();
  const isWideScreen = width >= WIDE_SCREEN_BREAKPOINT;
  const { triggerMedium, triggerLight, triggerSuccess } = useHaptics();
  const { playRollSound, playSelectSound, playScoreSound, playYahtzeeSound } = useSound();
  const { isMuted, toggleMute } = useSoundContext();

  const [popupScore, setPopupScore] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [bonusPopupVisible, setBonusPopupVisible] = useState(false);
  const bonusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  const {
    gameState,
    isRolling,
    rollDice,
    toggleHold,
    scoreCategory,
    getPotentialScore,
    forceYahtzee,
    totalScore,
  } = useGameState();

  const isYahtzee = gameState.dice.every(d => d.value === gameState.dice[0].value);

  const handleRoll = useCallback(() => {
    triggerMedium();
    playRollSound();
    rollDice();
    setSelectedCategoryIndex(null);
  }, [rollDice, triggerMedium, playRollSound]);

  const handleToggleHold = useCallback((dieId: number) => {
    triggerLight();
    playSelectSound();
    toggleHold(dieId);
  }, [toggleHold, triggerLight, playSelectSound]);

  const handleScoreCategory = useCallback((category: ScoreCategory) => {
    const scoredPoints = calculatePotentialScore(gameState.dice, category);
    triggerSuccess();
    const scoringYahtzee = isYahtzee && gameState.rollsLeft < MAX_ROLLS;
    const isYahtzeeBonus = scoringYahtzee && gameState.scorecard.yahtzee === YAHTZEE_POINTS;
    if (scoringYahtzee) {
      playYahtzeeSound();
      if (!isYahtzeeBonus) {
        setShowConfetti(true);
      }
    } else {
      playScoreSound();
    }
    setPopupScore(scoredPoints);
    setShowPopup(true);
    if (isYahtzeeBonus) {
      // Fire +100 popup and confetti as the first popup starts exiting (after its 500ms visible phase)
      if (bonusTimerRef.current) clearTimeout(bonusTimerRef.current);
      bonusTimerRef.current = setTimeout(() => {
        setBonusPopupVisible(true);
        setShowConfetti(true);
      }, 500);
    }
    scoreCategory(category);
  }, [scoreCategory, triggerSuccess, playScoreSound, playYahtzeeSound, isYahtzee, gameState.dice, gameState.rollsLeft, gameState.scorecard.yahtzee]);

  const handlePopupComplete = useCallback(() => {
    setShowPopup(false);
    setPopupScore(0);
  }, []);

  const getAvailableCategories = useCallback(() => {
    return ALL_CATEGORIES.filter(cat => gameState.scorecard[cat] === null);
  }, [gameState.scorecard]);

  const canHoldDice = gameState.rollsLeft < MAX_ROLLS && gameState.rollsLeft > 0;

  const handleKeyPress = useCallback((key: string) => {
    if (isRolling) return;
    // ESC opens the quit confirm dialog (closing is handled by the dialog itself)
    // But if the help modal is open, let it handle ESC instead
    if (key === 'Escape') {
      if (!showQuitConfirm && !showKeyboardHelp) setShowQuitConfirm(true);
      return;
    }
    // Other keys are blocked while quit confirm is showing
    if (showQuitConfirm) return;    const availableCategories = getAvailableCategories();
    switch (key) {
      case ' ':
        if (gameState.rollsLeft > 0) handleRoll();
        break;
      case 'Enter':
        if (selectedCategoryIndex !== null && availableCategories.length > 0 && gameState.rollsLeft < MAX_ROLLS) {
          const category = availableCategories[selectedCategoryIndex];
          if (category) { handleScoreCategory(category); setSelectedCategoryIndex(null); }
        }
        break;
      case '1': case '2': case '3': case '4': case '5':
        if (canHoldDice) handleToggleHold(parseInt(key) - 1);
        break;
      case 'ArrowUp':
        if (availableCategories.length > 0) {
          setSelectedCategoryIndex(prev =>
            prev === null || prev === 0 ? availableCategories.length - 1 : prev - 1
          );
        }
        break;
      case 'ArrowDown':
        if (availableCategories.length > 0) {
          setSelectedCategoryIndex(prev =>
            prev === null || prev >= availableCategories.length - 1 ? 0 : prev + 1
          );
        }
        break;
      case 'm': case 'M':
        toggleMute();
        break;
    }
  }, [isRolling, showQuitConfirm, showKeyboardHelp, gameState.rollsLeft, canHoldDice, selectedCategoryIndex, getAvailableCategories, handleRoll, handleToggleHold, handleScoreCategory, toggleMute]);

  useKeyboard(handleKeyPress, !gameState.isGameOver);
  const selectedCategory = selectedCategoryIndex !== null
    ? getAvailableCategories()[selectedCategoryIndex]
    : null;

  useEffect(() => {
    if (gameState.isGameOver) {
      onGameOver(totalScore);
    }
  }, [gameState.isGameOver, totalScore, onGameOver]);

  const diceSection = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: isWideScreen ? Spacing.lg : Spacing.xs,
      paddingBottom: isWideScreen ? Spacing.lg : Spacing.xs,
      backgroundColor: isWideScreen ? 'transparent' : Colors.surface,
      borderBottom: isWideScreen ? 'none' : `1px solid ${Colors.border}`,
      flexShrink: 0,
    }}>
      <DiceTray
        dice={gameState.dice}
        onToggleHold={handleToggleHold}
        disabled={!canHoldDice || isRolling}
        isRolling={isRolling}
      />
      <RollButton
        onRoll={handleRoll}
        rollsLeft={gameState.rollsLeft}
        disabled={gameState.rollsLeft <= 0 || isRolling}
      />
      {isWideScreen && (
        <span style={{ fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing.md, letterSpacing: 1 }}>
          {!canHoldDice
            ? 'Roll the dice to start your turn'
            : canHoldDice && gameState.rollsLeft > 0
            ? 'Tap dice to hold, then roll or select a score'
            : 'Select a category to score'}
        </span>
      )}
    </div>
  );

  const scorecardSection = (
    <div style={{
      flex: 1,
      padding: isWideScreen ? Spacing.lg : Spacing.md,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <Scorecard
        scorecard={gameState.scorecard}
        onScoreCategory={handleScoreCategory}
        getPotentialScore={getPotentialScore}
        yahtzeeBonus={gameState.yahtzeeBonus}
        totalScore={totalScore}
        selectedCategory={selectedCategory}
      />
    </div>
  );

  return (
    <div style={{
      flex: 1,
      backgroundColor: Colors.background,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
      <ScorePopup score={popupScore} visible={showPopup} onComplete={handlePopupComplete} />
      <ScorePopup score={YAHTZEE_BONUS_POINTS} visible={bonusPopupVisible} onComplete={() => setBonusPopupVisible(false)} topPercent={52} />
      {showQuitConfirm && (
        <QuitConfirmModal
          onConfirm={onQuit}
          onCancel={() => setShowQuitConfirm(false)}
        />
      )}

      {/* Header */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: Spacing.md,
        paddingRight: Spacing.md,
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.sm,
        backgroundColor: Colors.surface,
        borderBottom: `1px solid ${Colors.border}`,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
          <HeaderButton label="QUIT" onClick={() => setShowQuitConfirm(true)} color={Colors.error} />
          <HeaderButton label={isMuted ? 'UNMUTE' : 'MUTE'} onClick={toggleMute} />
          <HelpButton onClick={() => setShowKeyboardHelp(true)} />
          {import.meta.env.DEV && (
            <HeaderButton label="YAHTZEE!" onClick={forceYahtzee} color={Colors.accent} />
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: FontSize.xs, color: Colors.textSecondary, letterSpacing: 2 }}>ROUND</span>
          <span style={{ fontSize: FontSize.lg, fontWeight: 'bold', color: Colors.text }}>
            {Math.min(gameState.currentRound, TOTAL_ROUNDS)}/{TOTAL_ROUNDS}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ fontSize: FontSize.xs, color: Colors.textSecondary, letterSpacing: 2 }}>SCORE</span>
          <span style={{
            fontSize: FontSize.xl,
            fontWeight: 'bold',
            color: Colors.primary,
            textShadow: `0 0 8px ${Colors.primary}`,
          }}>
            {totalScore}
          </span>
        </div>
      </div>

      {/* Main Content */}
      {isWideScreen ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
          <div style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.surface,
            borderRight: `1px solid ${Colors.border}`,
          }}>
            {diceSection}
          </div>
          <div style={{ flex: 1, maxWidth: 500, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {scorecardSection}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {diceSection}
          {scorecardSection}
        </div>
      )}

      <KeyboardHelpModal visible={showKeyboardHelp} onClose={() => setShowKeyboardHelp(false)} />
    </div>
  );
}
