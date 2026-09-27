import React, { createContext, useContext, useState } from 'react';

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playClick: () => void;
  playAdd: () => void;
  playRemove: () => void;
  playSuccess: () => void;
  playCartOpen: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(true);

  const playClick = () => {
    // Sound disabled by user request
  };

  const playAdd = () => {
    // Sound disabled by user request
  };

  const playRemove = () => {
    // Sound disabled by user request
  };

  const playSuccess = () => {
    // Sound disabled by user request
  };

  const playCartOpen = () => {
    // Sound disabled by user request
  };

  return (
    <SoundContext.Provider
      value={{
        isMuted,
        toggleMute: () => setIsMuted((prev) => !prev),
        playClick,
        playAdd,
        playRemove,
        playSuccess,
        playCartOpen,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
