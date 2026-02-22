import { useCallback } from 'react';
import { useSoundContext } from '../contexts/SoundContext';

type SoundType = 'roll' | 'select' | 'score' | 'yahtzee';

function soundPath(file: string): string {
  return `${import.meta.env.BASE_URL}audio/${file}`;
}

export function useSound() {
  const { isMuted } = useSoundContext();

  const playSound = useCallback((type: SoundType) => {
    if (isMuted) return;
    try {
      const audio = new Audio(soundPath(`${type}.wav`));
      audio.volume = 0.7;
      audio.play().catch(() => {
        // Silently fail - audio is not critical
      });
    } catch (error) {
      // Silently fail
    }
  }, [isMuted]);

  const playRollSound = useCallback(() => playSound('roll'), [playSound]);
  const playSelectSound = useCallback(() => playSound('select'), [playSound]);
  const playScoreSound = useCallback(() => playSound('score'), [playSound]);
  const playYahtzeeSound = useCallback(() => playSound('yahtzee'), [playSound]);

  return {
    playRollSound,
    playSelectSound,
    playScoreSound,
    playYahtzeeSound,
  };
}
