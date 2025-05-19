// context/SharedStateContext.tsx
import React, { createContext, useState, useContext } from 'react';

type SharedState = {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
};

const SharedStateContext = createContext<SharedState | undefined>(undefined);

export const SharedStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <SharedStateContext.Provider value={{ selectedId, setSelectedId }}>
      {children}
    </SharedStateContext.Provider>
  );
};

export const useSharedState = () => {
  const context = useContext(SharedStateContext);
  if (!context) {
    throw new Error('useSharedState must be used within a SharedStateProvider');
  }
  return context;
};