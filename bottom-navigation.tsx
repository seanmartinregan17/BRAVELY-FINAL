import { useLocation, Link } from "wouter";
import { Home, List, TrendingUp, Brain, User } from "lucide-react";

export default function BottomNavigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/sessions", icon: List, label: "Sessions" },
    { path: "/progress", icon: TrendingUp, label: "Progress" },
    { path: "/cbt-tools", icon: Brain, label: "Tools" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-background/95 backdrop-blur-xl border-t border-border/80 shadow-2xl z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-center justify-around py-3">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location === path;
          return (
            <Link key={path} href={path}>
              <button
                className={`flex flex-col items-center py-2 px-4 transition-all duration-200 rounded-xl ${
                  isActive
                    ? "text-primary bg-primary/15 shadow-sm scale-105"
                    : "text-foreground/80 hover:text-foreground hover:bg-muted/50 hover:scale-105"
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className="text-xs font-bold">{label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
