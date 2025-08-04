export interface AuthUser {
  id: string;
  email: string;
  name: string;
  subscriptionStatus: 'active' | 'inactive' | 'trial';
  subscriptionPlan?: string;
  subscriptionExpiresAt?: string;
  onboardingCompleted: boolean;
  createdAt: string;
}

const AUTH_STORAGE_KEY = 'bravely_auth_user';

export const authStorage = {
  getUser(): AuthUser | null {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  setUser(user: AuthUser): void {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  },

  clearUser(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
};