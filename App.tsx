import React, { useState, useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { ScreenManager } from './src/components/ScreenManager';
import { SoundProvider } from './src/contexts/SoundContext';
import { SplashScreen } from './src/screens/SplashScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { GameScreen } from './src/screens/GameScreen';
import { ResultsScreen } from './src/screens/ResultsScreen';
import { Colors } from './src/utils/constants';

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
        <ScreenManager screenKey={currentScreen}>
          {renderScreen()}
        </ScreenManager>
      </View>
    </SoundProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
