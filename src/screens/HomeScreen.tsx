import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { Logo } from '../components/Logo';
import { Colors, Spacing, FontSize, BorderRadius, Glow } from '../utils/constants';
import { loadHighScores } from '../utils/storage';

interface HomeScreenProps {
  onStartGame: () => void;
}

export function HomeScreen({ onStartGame }: HomeScreenProps) {
  const [highScore, setHighScore] = useState<number | null>(null);

  useEffect(() => {
    const fetchHighScore = async () => {
      const scores = await loadHighScores();
      if (scores.length > 0) {
        setHighScore(scores[0].score);
      }
    };
    fetchHighScore();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Logo size="small" />
          </View>

          <View style={styles.diceDecoration}>
            {[5, 3, 6, 2, 4].map((num, index) => (
              <View key={index} style={[styles.decorativeDie, index === 2 && styles.decorativeDieCenter]}>
                <Text style={[styles.dieNumber, index === 2 && styles.dieNumberCenter]}>{num}</Text>
              </View>
            ))}
          </View>

          {highScore !== null && (
            <Text style={styles.highScoreText}>HIGH SCORE: {highScore}</Text>
          )}

          <View style={styles.buttonContainer}>
            <Pressable 
              style={({ hovered, pressed }) => [
                styles.playButton,
                hovered && styles.playButtonHovered,
                pressed && styles.playButtonPressed,
              ]} 
              onPress={onStartGame}
            >
              <Text style={styles.playButtonText}>PLAY</Text>
            </Pressable>

            <Pressable 
              style={({ hovered, pressed }) => [
                styles.secondaryButton,
                hovered && styles.secondaryButtonHovered,
                pressed && styles.secondaryButtonPressed,
              ]}
            >
              <Text style={styles.secondaryButtonText}>HOW TO PLAY</Text>
            </Pressable>

            <Pressable 
              style={({ hovered, pressed }) => [
                styles.secondaryButton,
                hovered && styles.secondaryButtonHovered,
                pressed && styles.secondaryButtonPressed,
              ]}
            >
              <Text style={styles.secondaryButtonText}>HIGH SCORES</Text>
            </Pressable>
          </View>

          <Text style={styles.footer}>
            {Platform.OS === 'web' ? 'CLICK PLAY TO START' : 'TAP PLAY TO START'}
          </Text>
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
  logoContainer: {
    marginBottom: Spacing.xxl,
  },
  diceDecoration: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  highScoreText: {
    color: Colors.accent,
    fontSize: FontSize.md,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: Spacing.xl,
    textShadowColor: Colors.accent,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  decorativeDie: {
    width: 50,
    height: 50,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Glow.subtle,
  },
  decorativeDieCenter: {
    width: 60,
    height: 60,
    borderColor: Colors.accent,
    shadowColor: Colors.accent,
  },
  dieNumber: {
    fontSize: FontSize.xl,
    fontWeight: 'bold',
    color: Colors.primary,
    textShadowColor: Colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  dieNumberCenter: {
    fontSize: FontSize.xxl,
    color: Colors.accent,
    textShadowColor: Colors.accent,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: Spacing.md,
  },
  playButton: {
    backgroundColor: 'transparent',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.success,
    ...Glow.green,
  },
  playButtonHovered: {
    backgroundColor: Colors.success + '15',
    shadowRadius: 15,
  },
  playButtonPressed: {
    backgroundColor: Colors.success + '30',
    transform: [{ scale: 0.98 }],
  },
  playButtonText: {
    color: Colors.success,
    fontSize: FontSize.xxl,
    fontWeight: 'bold',
    letterSpacing: 6,
    textShadowColor: Colors.success,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryButtonHovered: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  secondaryButtonPressed: {
    backgroundColor: Colors.primary + '20',
    transform: [{ scale: 0.98 }],
  },
  secondaryButtonText: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '600',
    letterSpacing: 2,
  },
  footer: {
    position: 'absolute',
    bottom: Spacing.xxl,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    letterSpacing: 4,
  },
});
