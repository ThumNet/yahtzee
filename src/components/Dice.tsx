import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { Die as DieType } from '../types';
import { Colors, BorderRadius, Glow } from '../utils/constants';

interface DiceProps {
  die: DieType;
  onToggleHold: (id: number) => void;
  disabled?: boolean;
  isRolling?: boolean;
}

// Dot positions for each die face
const DOT_POSITIONS: Record<number, { top?: number; bottom?: number; left?: number; right?: number; center?: boolean }[]> = {
  1: [{ center: true }],
  2: [{ top: 10, right: 10 }, { bottom: 10, left: 10 }],
  3: [{ top: 10, right: 10 }, { center: true }, { bottom: 10, left: 10 }],
  4: [{ top: 10, left: 10 }, { top: 10, right: 10 }, { bottom: 10, left: 10 }, { bottom: 10, right: 10 }],
  5: [{ top: 10, left: 10 }, { top: 10, right: 10 }, { center: true }, { bottom: 10, left: 10 }, { bottom: 10, right: 10 }],
  6: [{ top: 10, left: 10 }, { top: 10, right: 10 }, { left: 10 }, { right: 10 }, { bottom: 10, left: 10 }, { bottom: 10, right: 10 }],
};

// Random helper
function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomSign(): number {
  return Math.random() > 0.5 ? 1 : -1;
}

export function Dice({ die, onToggleHold, disabled = false, isRolling = false }: DiceProps) {
  const dots = DOT_POSITIONS[die.value] || [];
  
  // Animation values
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const translateXAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Store random parameters for this roll
  const randomParamsRef = useRef({
    rotationIntensity: 20,
    rotationDirection: 1,
    bounceHeight: 15,
    secondBounceHeight: 8,
    scaleAmount: 1.1,
    shakeCount: 3,
    delay: 0,
    horizontalShake: 0,
  });

  useEffect(() => {
    if (isRolling && !die.isHeld) {
      // Generate new random parameters for this roll
      const params = {
        rotationIntensity: randomBetween(15, 35),
        rotationDirection: randomSign(),
        bounceHeight: randomBetween(10, 25),
        secondBounceHeight: randomBetween(4, 12),
        scaleAmount: randomBetween(1.05, 1.2),
        shakeCount: Math.floor(randomBetween(2, 5)),
        delay: randomBetween(0, 50),
        horizontalShake: randomBetween(3, 8) * randomSign(),
      };
      randomParamsRef.current = params;

      // Reset animations
      rotateAnim.setValue(0);
      scaleAnim.setValue(1);
      translateYAnim.setValue(0);
      translateXAnim.setValue(0);

      // Glow pulse during roll
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: false,
        }),
      ]).start();

      // Build shake sequence based on random shake count
      const shakeSequence: Animated.CompositeAnimation[] = [];
      const shakeDuration = Math.floor(80 / params.shakeCount * 2);
      
      for (let i = 0; i < params.shakeCount; i++) {
        shakeSequence.push(
          Animated.timing(rotateAnim, {
            toValue: params.rotationDirection,
            duration: shakeDuration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: -params.rotationDirection,
            duration: shakeDuration,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        );
      }
      shakeSequence.push(
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: shakeDuration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        })
      );

      // Randomized timing
      const bounceDuration1 = randomBetween(80, 120);
      const bounceDuration2 = randomBetween(80, 120);
      const bounceDuration3 = randomBetween(60, 100);
      const bounceDuration4 = randomBetween(100, 150);

      // Run roll animation with delay
      setTimeout(() => {
        Animated.parallel([
          // Shake/rotate animation
          Animated.sequence(shakeSequence),
          // Horizontal shake
          Animated.sequence([
            Animated.timing(translateXAnim, {
              toValue: params.horizontalShake,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(translateXAnim, {
              toValue: -params.horizontalShake * 0.7,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(translateXAnim, {
              toValue: params.horizontalShake * 0.4,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(translateXAnim, {
              toValue: 0,
              duration: 80,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
          // Bounce animation
          Animated.sequence([
            Animated.timing(translateYAnim, {
              toValue: -params.bounceHeight,
              duration: bounceDuration1,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(translateYAnim, {
              toValue: 0,
              duration: bounceDuration2,
              easing: Easing.bounce,
              useNativeDriver: true,
            }),
            Animated.timing(translateYAnim, {
              toValue: -params.secondBounceHeight,
              duration: bounceDuration3,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(translateYAnim, {
              toValue: 0,
              duration: bounceDuration4,
              easing: Easing.bounce,
              useNativeDriver: true,
            }),
          ]),
          // Scale pop animation
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: params.scaleAmount,
              duration: randomBetween(100, 180),
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: randomBetween(200, 300),
              easing: Easing.elastic(randomBetween(1.0, 1.5)),
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      }, params.delay);
    }
  }, [isRolling, die.isHeld, die.value]);

  const rotation = rotateAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [
      `${-randomParamsRef.current.rotationIntensity}deg`,
      '0deg',
      `${randomParamsRef.current.rotationIntensity}deg`,
    ],
  });

  const animatedStyle = {
    transform: [
      { translateX: translateXAnim },
      { translateY: translateYAnim },
      { rotate: rotation },
      { scale: scaleAnim },
    ],
  };

  const glowStyle = die.isHeld ? Glow.magenta : Glow.cyan;

  return (
    <TouchableOpacity
      onPress={() => !disabled && onToggleHold(die.id)}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Animated.View style={[styles.die, die.isHeld && styles.dieHeld, glowStyle, animatedStyle]}>
        {dots.map((pos, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              pos.center && styles.dotCenter,
              pos.top !== undefined && { top: pos.top },
              pos.bottom !== undefined && { bottom: pos.bottom },
              pos.left !== undefined && { left: pos.left },
              pos.right !== undefined && { right: pos.right },
              !pos.center && !pos.top && !pos.bottom && pos.left !== undefined && styles.dotMiddleLeft,
              !pos.center && !pos.top && !pos.bottom && pos.right !== undefined && styles.dotMiddleRight,
            ]}
          />
        ))}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  die: {
    width: 64,
    height: 64,
    backgroundColor: Colors.diceBackground,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.diceBorder,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dieHeld: {
    backgroundColor: Colors.diceHeld,
    borderColor: Colors.diceHeldBorder,
  },
  dot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.diceDots,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  dotCenter: {
    position: 'relative',
    top: undefined,
    bottom: undefined,
    left: undefined,
    right: undefined,
  },
  dotMiddleLeft: {
    top: '50%',
    marginTop: -5,
  },
  dotMiddleRight: {
    top: '50%',
    marginTop: -5,
  },
});
