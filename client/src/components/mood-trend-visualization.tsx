import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Minus, Heart } from "lucide-react";
import type { AuthUser } from "@/lib/auth";

interface MoodTrendVisualizationProps {
  user: AuthUser;
}

export default function MoodTrendVisualization({ user }: MoodTrendVisualizationProps) {
  const { data: sessions } = useQuery({
    queryKey: ["/api/sessions", user.id],
    enabled: !!user.id,
  });

  if (!sessions || sessions.length < 2) return null;

  // Calculate mood trends
  const calculateTrend = () => {
    const recentSessions = sessions.slice(0, 5); // Last 5 sessions
    const fearLevels = recentSessions.map((s: any) => s.fearLevelAfter || s.fearLevelBefore || 5);
    
    if (fearLevels.length < 2) return null;

    const firstLevel = fearLevels[fearLevels.length - 1];
    const lastLevel = fearLevels[0];
    const change = firstLevel - lastLevel;
    const percentChange = Math.abs((change / firstLevel) * 100);

    return {
      direction: change > 0.5 ? 'down' : change < -0.5 ? 'up' : 'stable',
      change: Math.abs(change),
      percent: Math.round(percentChange),
      message: change > 0.5 
        ? `Fear levels decreased by ${percentChange.toFixed(0)}%`
        : change < -0.5 
        ? `Fear levels increased - that's normal, keep going!`
        : 'Fear levels are staying consistent'
    };
  };

  const trend = calculateTrend();
  if (!trend) return null;

  const getTrendIcon = () => {
    switch (trend.direction) {
      case 'down': return TrendingDown;
      case 'up': return TrendingUp;
      default: return Minus;
    }
  };

  const getTrendColor = () => {
    switch (trend.direction) {
      case 'down': return 'from-green-500 to-emerald-500';
      case 'up': return 'from-amber-500 to-orange-500';
      default: return 'from-blue-500 to-indigo-500';
    }
  };

  const TrendIcon = getTrendIcon();

  return (
    <Card className="mt-6 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-100 dark:from-rose-900/30 dark:via-pink-900/40 dark:to-purple-900/50 border border-rose-200/50 dark:border-rose-700/50 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 bg-gradient-to-r ${getTrendColor()} rounded-full flex items-center justify-center`}>
            <TrendIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm text-gray-800 mb-1 flex items-center">
              <Heart className="w-4 h-4 mr-2 text-pink-600" />
              Your Progress Trend
            </h3>
            <p className="text-sm text-gray-700">{trend.message}</p>
            {trend.direction === 'down' && (
              <p className="text-xs text-green-700 mt-1">You're building confidence! 🌟</p>
            )}
            {trend.direction === 'stable' && (
              <p className="text-xs text-blue-700 mt-1">Consistency is key to progress! 💪</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}