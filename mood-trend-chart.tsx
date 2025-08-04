import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MoodTrendChartProps {
  sessions: any[];
  days?: number;
}

export default function MoodTrendChart({ sessions, days = 7 }: MoodTrendChartProps) {
  // Get sessions from the last X days
  const getRecentSessions = () => {
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
    
    return sessions
      .filter(session => new Date(session.startTime) >= cutoffDate)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  };

  const recentSessions = getRecentSessions();
  
  // Create daily mood averages
  const dailyMoods = () => {
    const moodsByDay: { [key: string]: number[] } = {};
    
    recentSessions.forEach(session => {
      const date = new Date(session.startTime).toDateString();
      if (!moodsByDay[date]) {
        moodsByDay[date] = [];
      }
      // Use moodAfter if available, otherwise moodBefore
      const mood = session.moodAfter || session.moodBefore;
      if (mood) {
        moodsByDay[date].push(mood);
      }
    });
    
    // Calculate averages for each day
    return Object.entries(moodsByDay).map(([date, moods]) => ({
      date,
      avgMood: moods.length > 0 ? moods.reduce((sum, mood) => sum + mood, 0) / moods.length : 0,
      sessionCount: moods.length
    }));
  };

  const moodData = dailyMoods();
  
  if (moodData.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/30 border-emerald-200 dark:border-emerald-800">
        <CardContent className="p-6 text-center">
          <TrendingUp className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2">Mood Trends</h3>
          <p className="text-sm text-emerald-600 dark:text-emerald-300">
            Complete more sessions to see your mood trends over the last {days} days
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate trend
  const getMoodTrend = () => {
    if (moodData.length < 2) return "neutral";
    
    const firstMood = moodData[0].avgMood;
    const lastMood = moodData[moodData.length - 1].avgMood;
    const difference = lastMood - firstMood;
    
    if (difference > 0.5) return "improving";
    if (difference < -0.5) return "declining";
    return "stable";
  };

  const trend = getMoodTrend();
  const maxMood = Math.max(...moodData.map(d => d.avgMood));
  const minMood = Math.min(...moodData.map(d => d.avgMood));
  const range = Math.max(maxMood - minMood, 0.1); // Ensure minimum range to prevent division by zero

  const getTrendIcon = () => {
    switch (trend) {
      case "improving": return <TrendingUp className="w-5 h-5 text-green-600" />;
      case "declining": return <TrendingDown className="w-5 h-5 text-orange-600" />;
      default: return <Minus className="w-5 h-5 text-blue-600" />;
    }
  };

  const getTrendMessage = () => {
    switch (trend) {
      case "improving": return "Your mood has been trending upward!";
      case "declining": return "Consider using CBT tools for support";
      default: return "Your mood has been stable";
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case "improving": return "text-green-600 dark:text-green-400";
      case "declining": return "text-orange-600 dark:text-orange-400";
      default: return "text-blue-600 dark:text-blue-400";
    }
  };

  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/30 border-emerald-200 dark:border-emerald-800">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
            {getTrendIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-emerald-800 dark:text-emerald-200">Mood Trends</h3>
            <p className="text-sm text-emerald-600 dark:text-emerald-300">Last {days} days</p>
          </div>
        </div>

        {/* Simple line chart */}
        <div className="mb-4">
          <div className="h-24 flex items-end justify-between gap-1 bg-white/50 dark:bg-emerald-900/20 rounded-lg p-3">
            {moodData.map((day, index) => {
              const height = ((day.avgMood - minMood) / range) * 100;
              const barHeight = Math.max(height, 10); // Minimum height for visibility
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">
                    {day.sessionCount}
                  </div>
                  <div 
                    className="w-full bg-gradient-to-t from-emerald-400 to-teal-500 rounded-sm transition-all duration-300"
                    style={{ height: `${barHeight}%` }}
                    title={`${day.avgMood.toFixed(1)} average mood, ${day.sessionCount} sessions`}
                  />
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                    {new Date(day.date).getDate()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trend summary */}
        <div className="bg-white/60 dark:bg-emerald-900/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            {getTrendIcon()}
            <span className={`font-medium ${getTrendColor()}`}>
              {trend.charAt(0).toUpperCase() + trend.slice(1)} Trend
            </span>
          </div>
          <p className="text-sm text-emerald-700 dark:text-emerald-300">
            {getTrendMessage()}
          </p>
        </div>

        {/* Mood scale reference */}
        <div className="mt-3 flex justify-between text-xs text-emerald-600 dark:text-emerald-400">
          <span>😰 Anxious (1)</span>
          <span>😐 Neutral (3)</span>
          <span>😊 Great (5)</span>
        </div>
      </CardContent>
    </Card>
  );
}