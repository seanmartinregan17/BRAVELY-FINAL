export interface ActiveSessionData {
  id: string
  startTime: string
  location?: {
    latitude: number
    longitude: number
  }
  sessionType: string
  anxietyLevel: number
}

class SessionStorage {
  private readonly storageKey = 'bravely-active-session'

  getActiveSession(): ActiveSessionData | null {
    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  setActiveSession(session: ActiveSessionData): void {
    localStorage.setItem(this.storageKey, JSON.stringify(session))
  }

  clearActiveSession(): void {
    localStorage.removeItem(this.storageKey)
  }
}

export const sessionStorage = new SessionStorage()