import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundContext(): SoundContextType {
  const ctx = useContext(SoundContext);
  if (ctx === undefined) {
    throw new Error('useSoundContext must be used within a SoundProvider');
  }
  return ctx;
}
