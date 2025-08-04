import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GlobalSession {
  isActive: boolean;
  sessionId?: string;
  startTime?: Date;
  location?: {
    latitude: number;
    longitude: number;
  };
}

interface GlobalSessionContextType {
  session: GlobalSession;
  startSession: (sessionId: string, location?: { latitude: number; longitude: number }) => void;
  endSession: () => void;
  updateLocation: (location: { latitude: number; longitude: number }) => void;
}

const GlobalSessionContext = createContext<GlobalSessionContextType | undefined>(undefined);

export function GlobalSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<GlobalSession>({ isActive: false });

  const startSession = (sessionId: string, location?: { latitude: number; longitude: number }) => {
    setSession({
      isActive: true,
      sessionId,
      startTime: new Date(),
      location,
    });
  };

  const endSession = () => {
    setSession({ isActive: false });
  };

  const updateLocation = (location: { latitude: number; longitude: number }) => {
    setSession(prev => ({ ...prev, location }));
  };

  return (
    <GlobalSessionContext.Provider value={{ session, startSession, endSession, updateLocation }}>
      {children}
    </GlobalSessionContext.Provider>
  );
}

export function useGlobalSession() {
  const context = useContext(GlobalSessionContext);
  if (context === undefined) {
    throw new Error('useGlobalSession must be used within a GlobalSessionProvider');
  }
  return context;
}