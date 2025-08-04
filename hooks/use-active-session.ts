import { useGlobalSession } from './use-global-session'

export function useActiveSession() {
  const { activeSession, setActiveSession } = useGlobalSession()

  const startSession = (sessionData: any) => {
    setActiveSession(sessionData)
  }

  const endSession = () => {
    setActiveSession(null)
  }

  const isSessionActive = !!activeSession

  return {
    activeSession,
    startSession,
    endSession,
    isSessionActive,
  }
}