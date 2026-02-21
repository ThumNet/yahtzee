import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, Animated, Easing } from 'react-native';
import { Confetti } from '../components/Confetti';
import { Colors, Spacing, FontSize, BorderRadius, Glow } from '../utils/constants';
import { saveHighScore, loadHighScores } from '../utils/storage';

interface ResultsScreenProps {
  score: number;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export function ResultsScreen({ score, onPlayAgain, onGoHome }: ResultsScreenProps) {
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const glowAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const scoreAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Check and save high score
    const checkAndSaveScore = async () => {
      const scores = await loadHighScores();
      const currentHighScore = scores.length > 0 ? scores[0].score : 0;
      setHighScore(currentHighScore);
      
      if (score > currentHighScore) {
        setIsNewHighScore(true);
        // Trigger confetti for new high score
        setTimeout(() => setShowConfetti(true), 500);
      }
      
      // Save this score
      await saveHighScore({
        score,
        date: new Date().toISOString(),
        playerName: 'Player',
      });
    };
    
    checkAndSaveScore();
  }, [score]);

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(scoreAnim, {
        toValue: score,
        duration: 1500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start();

    // Continuous glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [score]);

  const getMessage = () => {
    if (isNewHighScore) return { text: 'NEW HIGH SCORE!', color: Colors.accent };
    if (score >= 300) return { text: 'LEGENDARY!', color: Colors.accent };
    if (score >= 250) return { text: 'AMAZING!', color: Colors.success };
    if (score >= 200) return { text: 'GREAT GAME!', color: Colors.primary };
    if (score >= 150) return { text: 'WELL DONE!', color: Colors.primary };
    if (score >= 100) return { text: 'GOOD EFFORT!', color: Colors.secondary };
    return { text: 'KEEP TRYING!', color: Colors.textSecondary };
  };

  const message = getMessage();

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const glowRadius = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 25],
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Confetti for new high score */}
      <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
      
      <View style={styles.content}>
        <Text style={styles.gameOverText}>GAME OVER</Text>
        
        <Animated.View 
          style={[
            styles.scoreCard,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Animated.Text 
            style={[
              styles.message,
              { 
                color: message.color,
                textShadowColor: message.color,
              },
            ]}
          >
            {message.text}
          </Animated.Text>
          <Text style={styles.scoreLabel}>FINAL SCORE</Text>
          <Animated.Text style={styles.score}>
            {scoreAnim.interpolate({
              inputRange: [0, score],
              outputRange: ['0', score.toString()],
              extrapolate: 'clamp',
            })}
          </Animated.Text>
          {!isNewHighScore && highScore > 0 && (
            <Text style={styles.highScoreText}>HIGH SCORE: {highScore}</Text>
          )}
        </Animated.View>

        <View style={styles.buttonContainer}>
          <Pressable 
            style={({ hovered, pressed }) => [
              styles.playAgainButton,
              hovered && styles.playAgainButtonHovered,
              pressed && styles.playAgainButtonPressed,
            ]} 
            onPress={onPlayAgain}
          >
            <Text style={styles.playAgainButtonText}>PLAY AGAIN</Text>
          </Pressable>

          <Pressable 
            style={({ hovered, pressed }) => [
              styles.homeButton,
              hovered && styles.homeButtonHovered,
              pressed && styles.homeButtonPressed,
            ]} 
            onPress={onGoHome}
          >
            <Text style={styles.homeButtonText}>HOME</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  gameOverText: {
    fontSize: FontSize.xxl,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
    letterSpacing: 6,
  },
  scoreCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    minWidth: 280,
    borderWidth: 2,
    borderColor: Colors.primary,
    ...Glow.cyan,
  },
  message: {
    fontSize: FontSize.xl,
    fontWeight: 'bold',
    marginBottom: Spacing.lg,
    letterSpacing: 3,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  scoreLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    letterSpacing: 3,
  },
  score: {
    fontSize: 72,
    fontWeight: 'bold',
    color: Colors.text,
    textShadowColor: Colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  highScoreText: {
    marginTop: Spacing.md,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    letterSpacing: 2,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: Spacing.md,
  },
  playAgainButton: {
    backgroundColor: 'transparent',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.success,
    ...Glow.green,
  },
  playAgainButtonHovered: {
    backgroundColor: Colors.success + '15',
    shadowRadius: 15,
  },
  playAgainButtonPressed: {
    backgroundColor: Colors.success + '30',
    transform: [{ scale: 0.98 }],
  },
  playAgainButtonText: {
    color: Colors.success,
    fontSize: FontSize.lg,
    fontWeight: 'bold',
    letterSpacing: 3,
    textShadowColor: Colors.success,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  homeButton: {
    backgroundColor: 'transparent',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  homeButtonHovered: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  homeButtonPressed: {
    backgroundColor: Colors.primary + '20',
    transform: [{ scale: 0.98 }],
  },
  homeButtonText: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    fontWeight: '600',
    letterSpacing: 2,
  },
});
