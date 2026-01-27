import React, { useState, useEffect, useRef, ReactNode } from 'react';
import { Animated, StyleSheet, View, Easing } from 'react-native';
import { Colors } from '../utils/constants';

interface ScreenManagerProps {
  screenKey: string;
  children: ReactNode;
  duration?: number;
}

export function ScreenManager({ screenKey, children, duration = 300 }: ScreenManagerProps) {
  const [currentScreen, setCurrentScreen] = useState<ReactNode>(children);
  const [previousScreen, setPreviousScreen] = useState<ReactNode>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const anim = useRef(new Animated.Value(1)).current;
  const prevKeyRef = useRef(screenKey);

  useEffect(() => {
    // If the screen key changed, start transition
    if (screenKey !== prevKeyRef.current) {
      setIsTransitioning(true);
      setPreviousScreen(currentScreen);
      
      // Start from 0
      anim.setValue(0);
      
      // Update to new screen
      setCurrentScreen(children);
      
      // Animate to 1
      Animated.timing(anim, {
        toValue: 1,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        setIsTransitioning(false);
        setPreviousScreen(null);
      });
      
      prevKeyRef.current = screenKey;
    } else {
      // Same screen, just update children
      setCurrentScreen(children);
    }
  }, [screenKey, children, duration]);

  // Zoom: new screen scales from 0.85 to 1, old screen scales from 1 to 1.1
  const newScreenScale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1],
  });

  const oldScreenScale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const newScreenOpacity = anim;

  const oldScreenOpacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <View style={styles.container}>
      {/* Previous screen (zooming out) */}
      {isTransitioning && previousScreen && (
        <Animated.View 
          style={[
            styles.screen, 
            { 
              opacity: oldScreenOpacity,
              transform: [{ scale: oldScreenScale }],
            }
          ]}
          pointerEvents="none"
        >
          {previousScreen}
        </Animated.View>
      )}
      
      {/* Current screen (zooming in) */}
      <Animated.View 
        style={[
          styles.screen, 
          { 
            opacity: newScreenOpacity,
            transform: [{ scale: newScreenScale }],
          }
        ]}
      >
        {currentScreen}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screen: {
    ...StyleSheet.absoluteFillObject,
  },
});
