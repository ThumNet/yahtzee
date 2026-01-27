import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';

interface ScreenTransitionProps {
  children: React.ReactNode;
  type?: 'fade' | 'slideUp' | 'slideLeft' | 'scale';
  duration?: number;
  style?: ViewStyle;
}

export function ScreenTransition({
  children,
  type = 'fade',
  duration = 300,
  style,
}: ScreenTransitionProps) {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  }, []);

  const getAnimatedStyle = () => {
    switch (type) {
      case 'fade':
        return {
          opacity: animValue,
        };
      case 'slideUp':
        return {
          opacity: animValue,
          transform: [
            {
              translateY: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        };
      case 'slideLeft':
        return {
          opacity: animValue,
          transform: [
            {
              translateX: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0],
              }),
            },
          ],
        };
      case 'scale':
        return {
          opacity: animValue,
          transform: [
            {
              scale: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
              }),
            },
          ],
        };
      default:
        return { opacity: animValue };
    }
  };

  return (
    <Animated.View style={[styles.container, style, getAnimatedStyle()]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
