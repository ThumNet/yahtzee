import { GameState, GameSettings, HighScore } from '../types';

const STORAGE_KEYS = {
  GAME_STATE: '@yahtzee/gameState',
  SETTINGS: '@yahtzee/settings',
  HIGH_SCORES: '@yahtzee/highScores',
};

function isValidHighScore(item: unknown): item is HighScore {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof (item as HighScore).score === 'number' &&
    typeof (item as HighScore).date === 'string' &&
    typeof (item as HighScore).playerName === 'string'
  );
}

// Game State
export async function saveGameState(gameState: GameState): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(gameState));
  } catch (error) {
    console.error('Error saving game state:', error);
  }
}

export async function loadGameState(): Promise<GameState | null> {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading game state:', error);
    return null;
  }
}

export async function clearGameState(): Promise<void> {
  try {
    localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
  } catch (error) {
    console.error('Error clearing game state:', error);
  }
}

// Settings
export async function saveSettings(settings: GameSettings): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

export async function loadSettings(): Promise<GameSettings> {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data
      ? JSON.parse(data)
      : {
          soundEnabled: true,
          hapticEnabled: true,
          theme: 'system',
        };
  } catch (error) {
    console.error('Error loading settings:', error);
    return {
      soundEnabled: true,
      hapticEnabled: true,
      theme: 'system',
    };
  }
}

// High Scores
export async function saveHighScore(score: HighScore): Promise<void> {
  try {
    const scores = await loadHighScores();
    scores.push(score);
    scores.sort((a, b) => b.score - a.score);
    const topScores = scores.slice(0, 10);
    localStorage.setItem(STORAGE_KEYS.HIGH_SCORES, JSON.stringify(topScores));
  } catch (error) {
    console.error('Error saving high score:', error);
  }
}

export async function loadHighScores(): Promise<HighScore[]> {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HIGH_SCORES);
    if (!data) return [];
    const parsed: unknown = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];
    const valid = parsed.filter(isValidHighScore);
    if (valid.length !== parsed.length) {
      console.warn('Some high score entries were malformed and discarded.');
    }
    return valid;
  } catch (error) {
    console.error('Error loading high scores:', error);
    return [];
  }
}

export async function clearHighScores(): Promise<void> {
  try {
    localStorage.removeItem(STORAGE_KEYS.HIGH_SCORES);
  } catch (error) {
    console.error('Error clearing high scores:', error);
  }
}
