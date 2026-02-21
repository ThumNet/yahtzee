import React, { useState, useCallback, lazy, Suspense } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { ScreenManager } from './src/components/ScreenManager';
import { SoundProvider } from './src/contexts/SoundContext';
import { Colors } from './src/utils/constants';

// Lazy load screens to reduce initial bundle size
const SplashScreen = lazy(() => import('./src/screens/SplashScreen').then(m => ({ default: m.SplashScreen })));
const HomeScreen = lazy(() => import('./src/screens/HomeScreen').then(m => ({ default: m.HomeScreen })));
const GameScreen = lazy(() => import('./src/screens/GameScreen').then(m => ({ default: m.GameScreen })));
const ResultsScreen = lazy(() => import('./src/screens/ResultsScreen').then(m => ({ default: m.ResultsScreen })));

type Screen = 'splash' | 'home' | 'game' | 'results';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [finalScore, setFinalScore] = useState(0);

  const handleSplashFinish = useCallback(() => {
    setCurrentScreen('home');
  }, []);

  const handleStartGame = useCallback(() => {
    setCurrentScreen('game');
  }, []);

  const handleGameOver = useCallback((score: number) => {
    setFinalScore(score);
    setCurrentScreen('results');
  }, []);

  const handleQuit = useCallback(() => {
    setCurrentScreen('home');
  }, []);

  const handlePlayAgain = useCallback(() => {
    setCurrentScreen('game');
  }, []);

  const handleGoHome = useCallback(() => {
    setCurrentScreen('home');
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onFinish={handleSplashFinish} />;
      case 'home':
        return <HomeScreen onStartGame={handleStartGame} />;
      case 'game':
        return <GameScreen onGameOver={handleGameOver} onQuit={handleQuit} />;
      case 'results':
        return (
          <ResultsScreen
            score={finalScore}
            onPlayAgain={handlePlayAgain}
            onGoHome={handleGoHome}
          />
        );
    }
  };

  return (
    <SoundProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        <Suspense fallback={
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        }>
          <ScreenManager screenKey={currentScreen}>
            {renderScreen()}
          </ScreenManager>
        </Suspense>
      </View>
    </SoundProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});
