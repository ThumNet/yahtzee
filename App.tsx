import React, { useState, useCallback } from 'react';
import { ScreenManager } from './src/components/ScreenManager';
import { SoundProvider } from './src/contexts/SoundContext';
import { Colors } from './src/utils/constants';
import { SplashScreen } from './src/screens/SplashScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { GameScreen } from './src/screens/GameScreen';
import { ResultsScreen } from './src/screens/ResultsScreen';
import { HighScoresScreen } from './src/screens/HighScoresScreen';
import { saveHighScore } from './src/utils/storage';

type Screen = 'splash' | 'home' | 'game' | 'results' | 'highscores';

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
    saveHighScore({ score, date: new Date().toISOString(), playerName: 'Player' });
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

  const handleShowHighScores = useCallback(() => {
    setCurrentScreen('highscores');
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onFinish={handleSplashFinish} />;
      case 'home':
        return <HomeScreen onStartGame={handleStartGame} onShowHighScores={handleShowHighScores} />;
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
      case 'highscores':
        return <HighScoresScreen onGoHome={handleGoHome} />;
    }
  };

  return (
    <SoundProvider>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, width: '100%', height: '100%', backgroundColor: Colors.background }}>
        <ScreenManager screenKey={currentScreen}>
          {renderScreen()}
        </ScreenManager>
      </div>
    </SoundProvider>
  );
}
