import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Dimensions, View } from 'react-native';
import { Colors } from '../utils/constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ConfettiPiece {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  rotation: Animated.Value;
  startX: number;
  scale: number;
  color: string;
  size: number;
}

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

const CONFETTI_COLORS = [
  Colors.primary,    // Cyan
  Colors.secondary,  // Magenta
  Colors.accent,     // Yellow
  Colors.success,    // Green
  '#ff6b6b',         // Red
  '#ffffff',         // White
];

const NUM_PIECES = 50;
const ANIMATION_DURATION = 3000;

export function Confetti({ active, onComplete }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (active && !hasAnimated.current) {
      hasAnimated.current = true;
      
      // Create confetti pieces
      const newPieces: ConfettiPiece[] = Array.from({ length: NUM_PIECES }, (_, i) => {
        const startX = Math.random() * SCREEN_WIDTH;
        return {
          id: i,
          x: new Animated.Value(startX),
          y: new Animated.Value(-50),
          rotation: new Animated.Value(0),
          startX,
          scale: 0.5 + Math.random() * 0.5,
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          size: 8 + Math.random() * 8,
        };
      });

      setPieces(newPieces);

      // Animate each piece
      const animations = newPieces.map((piece) => {
        const horizontalMovement = (Math.random() - 0.5) * 200;
        const fallDuration = ANIMATION_DURATION + Math.random() * 1000;
        const rotations = 2 + Math.random() * 4;

        return Animated.parallel([
          // Fall down with slight horizontal drift
          Animated.timing(piece.y, {
            toValue: SCREEN_HEIGHT + 50,
            duration: fallDuration,
            useNativeDriver: true,
          }),
          // Horizontal sway
          Animated.sequence([
            Animated.timing(piece.x, {
              toValue: piece.startX + horizontalMovement,
              duration: fallDuration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(piece.x, {
              toValue: piece.startX - horizontalMovement / 2,
              duration: fallDuration / 2,
              useNativeDriver: true,
            }),
          ]),
          // Spin
          Animated.timing(piece.rotation, {
            toValue: rotations,
            duration: fallDuration,
            useNativeDriver: true,
          }),
        ]);
      });

      Animated.stagger(30, animations).start(() => {
        setPieces([]);
        hasAnimated.current = false;
        onComplete?.();
      });
    } else if (!active) {
      hasAnimated.current = false;
    }
  }, [active]);

  if (pieces.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {pieces.map((piece) => (
        <Animated.View
          key={piece.id}
          style={[
            styles.piece,
            {
              width: piece.size,
              height: piece.size * 0.6,
              backgroundColor: piece.color,
              transform: [
                { translateX: piece.x },
                { translateY: piece.y },
                {
                  rotate: piece.rotation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
                { scale: piece.scale },
              ],
              shadowColor: piece.color,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  piece: {
    position: 'absolute',
    borderRadius: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});
