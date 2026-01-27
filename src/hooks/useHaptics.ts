import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export function useHaptics(enabled: boolean = true) {
  const triggerLight = useCallback(async () => {
    if (!enabled || Platform.OS === 'web') return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // Silently fail - haptics are not critical
    }
  }, [enabled]);

  const triggerMedium = useCallback(async () => {
    if (!enabled || Platform.OS === 'web') return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      // Silently fail
    }
  }, [enabled]);

  const triggerHeavy = useCallback(async () => {
    if (!enabled || Platform.OS === 'web') return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (error) {
      // Silently fail
    }
  }, [enabled]);

  const triggerSuccess = useCallback(async () => {
    if (!enabled || Platform.OS === 'web') return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      // Silently fail
    }
  }, [enabled]);

  const triggerWarning = useCallback(async () => {
    if (!enabled || Platform.OS === 'web') return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) {
      // Silently fail
    }
  }, [enabled]);

  const triggerError = useCallback(async () => {
    if (!enabled || Platform.OS === 'web') return;
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (error) {
      // Silently fail
    }
  }, [enabled]);

  const triggerSelection = useCallback(async () => {
    if (!enabled || Platform.OS === 'web') return;
    try {
      await Haptics.selectionAsync();
    } catch (error) {
      // Silently fail
    }
  }, [enabled]);

  return {
    triggerLight,
    triggerMedium,
    triggerHeavy,
    triggerSuccess,
    triggerWarning,
    triggerError,
    triggerSelection,
  };
}
