export interface AuthUser {
  id: string
  email: string
  name: string
  onboardingCompleted: boolean
  subscriptionActive: boolean
  subscriptionType?: string
}

class AuthStorage {
  private readonly storageKey = 'bravely-auth-user'

  getUser(): AuthUser | null {
    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  setUser(user: AuthUser): void {
    localStorage.setItem(this.storageKey, JSON.stringify(user))
  }

  clearUser(): void {
    localStorage.removeItem(this.storageKey)
  }
}

export const authStorage = new AuthStorage()