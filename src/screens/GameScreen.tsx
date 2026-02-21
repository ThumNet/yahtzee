import React, { useCallback, useState, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, useWindowDimensions, Platform } from 'react-native';
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
import { useSoundContext } from '../contexts/SoundContext';
import { Colors, Spacing, FontSize, BorderRadius, Glow } from '../utils/constants';
import { MAX_ROLLS, TOTAL_ROUNDS } from '../utils/constants';
import { ScoreCategory, ALL_CATEGORIES } from '../types';
import { calculatePotentialScore } from '../utils/scoring';

interface GameScreenProps {
  onGameOver: (score: number) => void;
  onQuit: () => void;
}

const WIDE_SCREEN_BREAKPOINT = 768;

export function GameScreen({ onGameOver, onQuit }: GameScreenProps) {
  const { width } = useWindowDimensions();
  const isWideScreen = width >= WIDE_SCREEN_BREAKPOINT;
  const { triggerMedium, triggerLight, triggerSuccess, triggerSelection } = useHaptics();
  const { playRollSound, playSelectSound, playScoreSound, playYahtzeeSound } = useSound();
  const { isMuted, toggleMute } = useSoundContext();

  // Score popup state
  const [popupScore, setPopupScore] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  const {
    gameState,
    isRolling,
    rollDice,
    toggleHold,
    scoreCategory,
    getPotentialScore,
    totalScore,
  } = useGameState();

  // Check if current dice are a Yahtzee (all same value)
  const isYahtzee = gameState.dice.every(d => d.value === gameState.dice[0].value);

  // Wrap rollDice with haptics and sound
  const handleRoll = useCallback(() => {
    triggerMedium();
    playRollSound();
    rollDice();
    setSelectedCategoryIndex(null);
  }, [rollDice, triggerMedium, playRollSound]);

  // Wrap toggleHold with haptics and sound
  const handleToggleHold = useCallback((dieId: number) => {
    triggerLight();
    playSelectSound();
    toggleHold(dieId);
  }, [toggleHold, triggerLight, playSelectSound]);

  // Wrap scoreCategory with haptics, sound, and animations
  const handleScoreCategory = useCallback((category: ScoreCategory) => {
    // Get the score before it's applied
    const scoredPoints = calculatePotentialScore(gameState.dice, category);
    
    triggerSuccess();
    
    // Check if this is a Yahtzee
    const scoringYahtzee = category === 'yahtzee' && isYahtzee && scoredPoints === 50;
    
    if (scoringYahtzee) {
      playYahtzeeSound();
      setShowConfetti(true);
    } else {
      playScoreSound();
    }
    
    // Show score popup
    setPopupScore(scoredPoints);
    setShowPopup(true);
    
    scoreCategory(category);
  }, [scoreCategory, triggerSuccess, playScoreSound, playYahtzeeSound, isYahtzee, gameState.dice]);

  const handlePopupComplete = useCallback(() => {
    setShowPopup(false);
    setPopupScore(0);
  }, []);

  // Get available (unscored) categories for keyboard navigation
  const getAvailableCategories = useCallback(() => {
    return ALL_CATEGORIES.filter(cat => gameState.scorecard[cat] === null);
  }, [gameState.scorecard]);

  const canHoldDice = gameState.rollsLeft < MAX_ROLLS;

  // Keyboard controls
  const handleKeyPress = useCallback((key: string) => {
    if (isRolling) return;

    const availableCategories = getAvailableCategories();
    
    switch (key) {
      // Roll dice
      case ' ':
        if (gameState.rollsLeft > 0) {
          handleRoll();
        }
        break;
      
      // Confirm selected category
      case 'Enter':
        if (selectedCategoryIndex !== null && availableCategories.length > 0 && gameState.rollsLeft < MAX_ROLLS) {
          const category = availableCategories[selectedCategoryIndex];
          if (category) {
            handleScoreCategory(category);
            setSelectedCategoryIndex(null);
          }
        }
        break;
      
      // Toggle dice hold (1-5 keys)
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
        if (canHoldDice) {
          const dieIndex = parseInt(key) - 1;
          handleToggleHold(dieIndex);
        }
        break;
      
      // Navigate categories
      case 'ArrowUp':
        if (availableCategories.length > 0) {
          setSelectedCategoryIndex(prev => {
            if (prev === null || prev === 0) {
              return availableCategories.length - 1;
            }
            return prev - 1;
          });
        }
        break;
      
      case 'ArrowDown':
        if (availableCategories.length > 0) {
          setSelectedCategoryIndex(prev => {
            if (prev === null || prev >= availableCategories.length - 1) {
              return 0;
            }
            return prev + 1;
          });
        }
        break;
      
      // Mute toggle
      case 'm':
      case 'M':
        toggleMute();
        break;
    }
  }, [isRolling, gameState.rollsLeft, canHoldDice, selectedCategoryIndex, getAvailableCategories, handleRoll, handleToggleHold, handleScoreCategory, toggleMute]);

  useKeyboard(handleKeyPress, !gameState.isGameOver);

  // Get the currently selected category for highlighting
  const selectedCategory = selectedCategoryIndex !== null 
    ? getAvailableCategories()[selectedCategoryIndex] 
    : null;

  // Check if game is over
  React.useEffect(() => {
    if (gameState.isGameOver) {
      onGameOver(totalScore);
    }
  }, [gameState.isGameOver, totalScore, onGameOver]);

  const renderDiceSection = () => (
    <View style={[styles.diceSection, isWideScreen && styles.diceSectionWide]}>
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
      <Text style={styles.hintText}>
        {!canHoldDice
          ? 'Roll the dice to start your turn'
          : canHoldDice && gameState.rollsLeft > 0
          ? 'Tap dice to hold, then roll or select a score'
          : 'Select a category to score'}
      </Text>
    </View>
  );

  const renderScorecard = () => (
    <View style={[styles.scorecardSection, isWideScreen && styles.scorecardSectionWide]}>
      <Scorecard
        scorecard={gameState.scorecard}
        onScoreCategory={handleScoreCategory}
        getPotentialScore={getPotentialScore}
        yahtzeeBonus={gameState.yahtzeeBonus}
        totalScore={totalScore}
        selectedCategory={selectedCategory}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Confetti overlay */}
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      {/* Score popup */}
      <ScorePopup score={popupScore} visible={showPopup} onComplete={handlePopupComplete} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable 
            onPress={onQuit} 
            style={({ hovered, pressed }) => [
              styles.quitButton,
              hovered && styles.quitButtonHovered,
              pressed && styles.quitButtonPressed,
            ]}
          >
            <Text style={styles.quitButtonText}>QUIT</Text>
          </Pressable>
          <Pressable 
            onPress={toggleMute} 
            style={({ hovered, pressed }) => [
              styles.muteButton,
              hovered && styles.muteButtonHovered,
              pressed && styles.muteButtonPressed,
            ]}
          >
            <Text style={styles.muteButtonText}>{isMuted ? 'UNMUTE' : 'MUTE'}</Text>
          </Pressable>
          {Platform.OS === 'web' && (
            <Pressable 
              onPress={() => setShowKeyboardHelp(true)} 
              style={({ hovered, pressed }) => [
                styles.helpButton,
                hovered && styles.helpButtonHovered,
                pressed && styles.helpButtonPressed,
              ]}
            >
              <Text style={styles.helpButtonText}>?</Text>
            </Pressable>
          )}
        </View>
        <View style={styles.roundContainer}>
          <Text style={styles.roundLabel}>ROUND</Text>
          <Text style={styles.roundText}>
            {Math.min(gameState.currentRound, TOTAL_ROUNDS)}/{TOTAL_ROUNDS}
          </Text>
        </View>
        <View style={styles.scoreDisplay}>
          <Text style={styles.scoreLabel}>SCORE</Text>
          <Text style={styles.scoreValue}>{totalScore}</Text>
        </View>
      </View>

      {/* Main Content - responsive layout */}
      {isWideScreen ? (
        <View style={styles.wideContent}>
          <View style={styles.leftPanel}>
            {renderDiceSection()}
          </View>
          <View style={styles.rightPanel}>
            {renderScorecard()}
          </View>
        </View>
      ) : (
        <>
          {renderDiceSection()}
          {renderScorecard()}
        </>
      )}

      {/* Keyboard help modal */}
      <KeyboardHelpModal 
        visible={showKeyboardHelp} 
        onClose={() => setShowKeyboardHelp(false)} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  quitButton: {
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: BorderRadius.md,
  },
  quitButtonHovered: {
    backgroundColor: Colors.error + '20',
  },
  quitButtonPressed: {
    backgroundColor: Colors.error + '40',
    transform: [{ scale: 0.95 }],
  },
  quitButtonText: {
    color: Colors.error,
    fontSize: FontSize.xs,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  muteButton: {
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.textSecondary,
    borderRadius: BorderRadius.md,
  },
  muteButtonHovered: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  muteButtonPressed: {
    backgroundColor: Colors.primary + '30',
    transform: [{ scale: 0.95 }],
  },
  muteButtonText: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  helpButton: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpButtonHovered: {
    backgroundColor: Colors.primary + '20',
    ...Glow.subtle,
  },
  helpButtonPressed: {
    backgroundColor: Colors.primary + '40',
    transform: [{ scale: 0.95 }],
  },
  helpButtonText: {
    color: Colors.primary,
    fontSize: FontSize.md,
    fontWeight: 'bold',
  },
  roundContainer: {
    alignItems: 'center',
  },
  roundLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    letterSpacing: 2,
  },
  roundText: {
    fontSize: FontSize.lg,
    fontWeight: 'bold',
    color: Colors.text,
  },
  scoreDisplay: {
    alignItems: 'flex-end',
  },
  scoreLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    letterSpacing: 2,
  },
  scoreValue: {
    fontSize: FontSize.xl,
    fontWeight: 'bold',
    color: Colors.primary,
    textShadowColor: Colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  // Mobile layout
  diceSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  hintText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    letterSpacing: 1,
  },
  scorecardSection: {
    flex: 1,
    padding: Spacing.md,
  },
  // Wide screen layout
  wideContent: {
    flex: 1,
    flexDirection: 'row',
  },
  leftPanel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  rightPanel: {
    flex: 1,
    maxWidth: 500,
  },
  diceSectionWide: {
    borderBottomWidth: 0,
    paddingVertical: Spacing.xxl,
    backgroundColor: 'transparent',
  },
  scorecardSectionWide: {
    flex: 1,
    padding: Spacing.lg,
  },
});
