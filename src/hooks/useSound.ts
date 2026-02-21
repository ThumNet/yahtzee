import { useCallback } from 'react';
import { useSoundContext } from '../contexts/SoundContext';

type SoundType = 'roll' | 'select' | 'score' | 'yahtzee';

const soundFiles: Record<SoundType, string> = {
  roll: '/assets/audio/roll.wav',
  select: '/assets/audio/select.wav',
  score: '/assets/audio/score.wav',
  yahtzee: '/assets/audio/yahtzee.wav',
};

export function useSound() {
  const { isMuted } = useSoundContext();

  const playSound = useCallback((type: SoundType) => {
    if (isMuted) return;
    try {
      const audio = new Audio(soundFiles[type]);
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
