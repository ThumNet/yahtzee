import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';
import { Colors, FontSize } from '../utils/constants';

interface ScorePopupProps {
  score: number;
  visible: boolean;
  onComplete?: () => void;
}

export function ScorePopup({ score, visible, onComplete }: ScorePopupProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (visible && score > 0) {
      // Reset
      translateY.setValue(0);
      opacity.setValue(1);
      scale.setValue(0.5);

      // Animate
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -60,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.spring(scale, {
            toValue: 1.2,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(400),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        onComplete?.();
      });
    }
  }, [visible, score]);

  if (!visible || score === 0) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }, { scale }],
          opacity,
        },
      ]}
      pointerEvents="none"
    >
      <Text style={styles.text}>+{score}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  text: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.success,
    textShadowColor: Colors.success,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
});
