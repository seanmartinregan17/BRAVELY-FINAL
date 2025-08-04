import { useState, useEffect } from "react";
import { authStorage, type AuthUser } from "./lib/auth";

function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedUser = await authStorage.getUser();
        if (savedUser) {
          setUser(savedUser);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Bravely
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your exposure therapy tracking app
            </p>
          </div>

          {user ? (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6">Hello, {user.name}!</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Start Session
                  </h3>
                  <p className="text-blue-700">
                    Begin a new exposure therapy session to track your progress
                  </p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    View Progress
                  </h3>
                  <p className="text-green-700">
                    Check your achievements and see how far you've come
                  </p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">
                    CBT Tools
                  </h3>
                  <p className="text-purple-700">
                    Access cognitive behavioral therapy resources
                  </p>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-900 mb-2">
                    Settings
                  </h3>
                  <p className="text-orange-700">
                    Customize your app experience and preferences
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
              <p className="text-gray-600 mb-6">
                Sign in to start tracking your exposure therapy journey
              </p>
              <button
                onClick={() => {
                  // Demo user for deployment testing
                  const demoUser: AuthUser = {
                    id: "demo-user",
                    email: "demo@example.com",
                    name: "Demo User",
                    onboarding_completed: true,
                    subscription_status: "active",
                    created_at: new Date().toISOString()
                  };
                  setUser(demoUser);
                  authStorage.setUser(demoUser);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Try Demo
              </button>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              🚀 Successfully deployed on Vercel (Frontend) + Railway (Backend)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;