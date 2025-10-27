import React, { createContext, useContext, useState, ReactNode } from 'react'
import { sessionStorage, type ActiveSessionData } from '@/lib/session-storage'

interface GlobalSessionContextType {
  activeSession: ActiveSessionData | null
  setActiveSession: (session: ActiveSessionData | null) => void
}

const GlobalSessionContext = createContext<GlobalSessionContextType | undefined>(undefined)

export function GlobalSessionProvider({ children }: { children: ReactNode }) {
  const [activeSession, setActiveSessionState] = useState<ActiveSessionData | null>(
    sessionStorage.getActiveSession()
  )

  const setActiveSession = (session: ActiveSessionData | null) => {
    setActiveSessionState(session)
    if (session) {
      sessionStorage.setActiveSession(session)
    } else {
      sessionStorage.clearActiveSession()
    }
  }

  return (
    <GlobalSessionContext.Provider value={{ activeSession, setActiveSession }}>
      {children}
    </GlobalSessionContext.Provider>
  )
}

export function useGlobalSession() {
  const context = useContext(GlobalSessionContext)
  if (context === undefined) {
    throw new Error('useGlobalSession must be used within a GlobalSessionProvider')
  }
  return context
}