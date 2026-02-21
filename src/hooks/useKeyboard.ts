import { useEffect, useCallback } from 'react';

type KeyHandler = (key: string) => void;

export function useKeyboard(onKeyPress: KeyHandler, enabled: boolean = true) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Ignore if user is typing in an input field
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    // Prevent default for keys we handle
    const handledKeys = [' ', 'Enter', '1', '2', '3', '4', '5', 'ArrowUp', 'ArrowDown', 'm', 'M'];
    if (handledKeys.includes(event.key)) {
      event.preventDefault();
    }

    onKeyPress(event.key);
  }, [onKeyPress, enabled]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
