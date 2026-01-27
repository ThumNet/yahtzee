import { useCallback, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import { useSoundContext } from '../contexts/SoundContext';

// Sound effect types
type SoundType = 'roll' | 'select' | 'score' | 'yahtzee';

// Sound file mappings
const soundFiles: Record<SoundType, any> = {
  roll: require('../../assets/audio/roll.wav'),
  select: require('../../assets/audio/select.wav'),
  score: require('../../assets/audio/score.wav'),
  yahtzee: require('../../assets/audio/yahtzee.wav'),
};

export function useSound() {
  const { isMuted } = useSoundContext();
  const soundRef = useRef<Audio.Sound | null>(null);
  const isInitialized = useRef(false);

  // Initialize audio mode
  useEffect(() => {
    const initAudio = async () => {
      if (isInitialized.current) return;
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
        isInitialized.current = true;
      } catch (error) {
        console.warn('Error initializing audio:', error);
      }
    };
    initAudio();

    // Clean up on unmount
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  // Play a sound effect
  const playSound = useCallback(async (type: SoundType) => {
    if (isMuted) return;

    try {
      // Unload previous sound if any
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      // Load and play the sound
      const { sound } = await Audio.Sound.createAsync(soundFiles[type], {
        shouldPlay: true,
        volume: 0.7,
      });
      soundRef.current = sound;

      // Auto-unload when finished
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          if (soundRef.current === sound) {
            soundRef.current = null;
          }
        }
      });
    } catch (error) {
      // Silently fail - audio is not critical
      console.warn('Error playing sound:', error);
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
