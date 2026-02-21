import { useCallback } from 'react';

// Haptics are not available on web - all functions are no-ops
export function useHaptics(_enabled: boolean = true) {
  const triggerLight = useCallback(async () => {}, []);
  const triggerMedium = useCallback(async () => {}, []);
  const triggerHeavy = useCallback(async () => {}, []);
  const triggerSuccess = useCallback(async () => {}, []);
  const triggerWarning = useCallback(async () => {}, []);
  const triggerError = useCallback(async () => {}, []);
  const triggerSelection = useCallback(async () => {}, []);

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
