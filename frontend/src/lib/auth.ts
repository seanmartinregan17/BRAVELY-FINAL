export interface AuthUser {
  id: string;
  email: string;
  name: string;
  onboarding_completed: boolean;
  subscription_status: 'active' | 'inactive' | 'trial';
  created_at: string;
}

export const authStorage = {
  async getUser(): Promise<AuthUser | null> {
    try {
      const userData = localStorage.getItem('bravely_user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  },

  async setUser(user: AuthUser): Promise<void> {
    localStorage.setItem('bravely_user', JSON.stringify(user));
  },

  async clearUser(): Promise<void> {
    localStorage.removeItem('bravely_user');
  },

  async getToken(): Promise<string | null> {
    return localStorage.getItem('bravely_token');
  },

  async setToken(token: string): Promise<void> {
    localStorage.setItem('bravely_token', token);
  },

  async clearToken(): Promise<void> {
    localStorage.removeItem('bravely_token');
  }
};