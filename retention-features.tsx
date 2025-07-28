import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Target, Flame, Award, TrendingUp, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RetentionFeaturesProps {
  user: any;
  sessions: any[];
  todayStats: any;
  weeklyStats: any[];
}

export default function RetentionFeatures({ user, sessions, todayStats, weeklyStats }: RetentionFeaturesProps) {
  const { toast } = useToast();
  const [dailyStreak, setDailyStreak] = useState(user.currentStreak || 0);
  const [weeklyGoalProgress, setWeeklyGoalProgress] = useState(0);
  const [milestones, setMilestones] = useState<any[]>([]);

  // Calculate retention metrics
  useEffect(() => {
    // Weekly goal progress calculation
    const weeklySessionCount = weeklyStats?.reduce((sum, day) => sum + (day.sessions || 0), 0) || 0;
    const weeklyGoal = user.weeklySessionGoal || 5;
    setWeeklyGoalProgress(Math.min((weeklySessionCount / weeklyGoal) * 100, 100));

    // Generate milestone tracking
    const totalSessions = sessions?.length || 0;
    const nextMilestones = [
      { target: 5, title: "First 5 Sessions", icon: "🎯", unlocked: totalSessions >= 5 },
      { target: 10, title: "Consistency Builder", icon: "💪", unlocked: totalSessions >= 10 },
      { target: 25, title: "Courage Champion", icon: "🏆", unlocked: totalSessions >= 25 },
      { target: 50, title: "Bravery Expert", icon: "⭐", unlocked: totalSessions >= 50 },
      { target: 100, title: "Fearless Leader", icon: "👑", unlocked: totalSessions >= 100 }
    ];
    
    setMilestones(nextMilestones);
  }, [sessions, weeklyStats, user]);

  // Find next milestone
  const nextMilestone = milestones.find(m => !m.unlocked);
  const totalSessions = sessions?.length || 0;
  const milestoneProgress = nextMilestone ? (totalSessions / nextMilestone.target) * 100 : 100;

  const handleCelebrateMilestone = (milestone: any) => {
    toast({
      title: `🎉 ${milestone.title} Achieved!`,
      description: `You've completed ${milestone.target} sessions. Amazing progress!`
    });
  };

  const getStreakMotivation = () => {
    if (dailyStreak >= 7) return "Week-long champion! Your consistency is inspiring.";
    if (dailyStreak >= 3) return "Building momentum! Don't break the streak.";
    if (dailyStreak >= 1) return "Great start! Consistency builds courage.";
    return "Ready to start your streak? One session at a time.";
  };

  const getWeeklyMotivation = () => {
    if (weeklyGoalProgress >= 100) return "Weekly goal crushed! 🚀";
    if (weeklyGoalProgress >= 80) return "So close to your weekly goal!";
    if (weeklyGoalProgress >= 50) return "Halfway to your weekly target!";
    return "Every session counts toward your weekly goal.";
  };

  return (
    <div className="space-y-4">
      {/* Streak Tracking */}
      <Card className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-100 dark:from-orange-900/30 dark:via-red-900/40 dark:to-pink-900/50 border border-orange-200/50 dark:border-orange-700/50 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <h3 className="font-semibold text-orange-800 dark:text-orange-200">Courage Streak</h3>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{dailyStreak}</p>
              <p className="text-xs text-orange-600 dark:text-orange-400">days</p>
            </div>
          </div>
          <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
            {getStreakMotivation()}
          </p>
          <div className="flex space-x-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded ${
                  i < (dailyStreak % 7) || (dailyStreak >= 7 && dailyStreak % 7 === 0)
                    ? 'bg-orange-500' 
                    : 'bg-orange-200 dark:bg-orange-800'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Goal Progress */}
      <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-blue-900/30 dark:via-indigo-900/40 dark:to-purple-900/50 border border-blue-200/50 dark:border-blue-700/50 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-blue-800 dark:text-blue-200">Weekly Progress</h3>
            </div>
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              {Math.round(weeklyGoalProgress)}%
            </span>
          </div>
          <Progress value={weeklyGoalProgress} className="mb-2" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {getWeeklyMotivation()}
          </p>
        </CardContent>
      </Card>

      {/* Milestone Tracking */}
      {nextMilestone && (
        <Card className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 dark:from-emerald-900/30 dark:via-green-900/40 dark:to-teal-900/50 border border-emerald-200/50 dark:border-emerald-700/50 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-200">Next Milestone</h3>
              </div>
              <span className="text-lg">{nextMilestone.icon}</span>
            </div>
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                  {nextMilestone.title}
                </span>
                <span className="text-sm text-emerald-600 dark:text-emerald-400">
                  {totalSessions}/{nextMilestone.target}
                </span>
              </div>
              <Progress value={milestoneProgress} className="h-2" />
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              {nextMilestone.target - totalSessions} more sessions to unlock this achievement!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions for Retention */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => toast({ title: "Reminder set!", description: "We'll remind you tomorrow to continue building courage" })}
          variant="outline"
          className="bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/40 border-violet-200 dark:border-violet-700 hover:from-violet-100 hover:to-purple-200"
        >
          <Clock className="w-4 h-4 mr-2 text-violet-600 dark:text-violet-400" />
          <span className="text-violet-700 dark:text-violet-300 text-sm">Set Reminder</span>
        </Button>

        <Button
          onClick={() => toast({ title: "Progress saved!", description: "Your achievements are now part of your journey story" })}
          variant="outline"
          className="bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/40 border-teal-200 dark:border-teal-700 hover:from-teal-100 hover:to-cyan-200"
        >
          <TrendingUp className="w-4 h-4 mr-2 text-teal-600 dark:text-teal-400" />
          <span className="text-teal-700 dark:text-teal-300 text-sm">Track Progress</span>
        </Button>
      </div>
    </div>
  );
}