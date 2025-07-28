import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Target, Award } from "lucide-react";

interface ProgressSummaryProps {
  sessions: any[];
  currentUser: any;
}

export default function ProgressSummary({ sessions, currentUser }: ProgressSummaryProps) {
  const weeklySessionCount = sessions?.filter((session: any) => {
    const sessionDate = new Date(session.createdAt);
    const currentDate = new Date();
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());
    return sessionDate >= weekStart && sessionDate <= currentDate;
  }).length || 0;

  const weeklyGoal = currentUser.monthlySessionGoal || 5;
  const progressPercentage = Math.min((weeklySessionCount / weeklyGoal) * 100, 100);

  const getProgressMessage = () => {
    if (weeklySessionCount === 0) return "Ready to start your weekly journey";
    if (weeklySessionCount >= weeklyGoal) return "🎉 Weekly goal achieved!";
    if (progressPercentage >= 75) return "Almost there! Keep going strong";
    if (progressPercentage >= 50) return "Great progress this week";
    return "Every session counts - you're building momentum";
  };

  const getGoalDescription = () => {
    if (weeklyGoal <= 2) return 'A gentle start for building consistency';
    if (weeklyGoal <= 5) return 'A balanced target for steady progress';
    return 'An ambitious goal for accelerated growth!';
  };

  return (
    <Card className="bg-gradient-to-b from-violet-50 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/50 border-0 shadow-lg">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-base font-semibold text-violet-800 dark:text-violet-200">Sessions Completed</p>
              <p className="text-sm text-violet-600 dark:text-violet-400">
                {Math.round(progressPercentage)}% Complete
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-violet-800 dark:text-violet-200">
              {weeklySessionCount} / {weeklyGoal}
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-violet-200/50 dark:bg-violet-800/30 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-full h-4 transition-all duration-500 ease-out" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Progress Message */}
        <div className="text-center mb-4">
          <p className="text-sm font-medium text-violet-700 dark:text-violet-300">
            {getProgressMessage()}
          </p>
        </div>

        {/* Goal Info */}
        <div className="bg-violet-100/50 dark:bg-violet-900/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <span className="text-sm font-medium text-violet-800 dark:text-violet-200">Weekly Goal</span>
            </div>
            <span className="text-lg font-bold text-violet-800 dark:text-violet-200">
              {weeklyGoal} sessions
            </span>
          </div>
          <div className="text-sm text-violet-600 dark:text-violet-400">
            {getGoalDescription()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}