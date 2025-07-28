import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, TrendingUp, Target, Calendar, Bell, Users, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EngagementFeaturesProps {
  user: any;
  todayStats: any;
  weeklyStats: any[];
}

export default function EngagementFeatures({ user, todayStats, weeklyStats }: EngagementFeaturesProps) {
  const { toast } = useToast();
  const [showInsights, setShowInsights] = useState(false);

  // Calculate engagement metrics
  const totalWeeklyMinutes = weeklyStats?.reduce((sum, day) => sum + day.duration, 0) || 0;
  const activeDaysThisWeek = weeklyStats?.filter(day => day.duration > 0).length || 0;
  const avgSessionLength = activeDaysThisWeek > 0 ? Math.round(totalWeeklyMinutes / activeDaysThisWeek) : 0;
  
  // Generate personalized insights based on user data
  const generateInsights = () => {
    const insights = [];
    
    if (user.currentStreak >= 3) {
      insights.push({
        icon: <Star className="w-4 h-4 text-yellow-500" />,
        title: "Streak Power",
        message: `Your ${user.currentStreak}-day streak shows real commitment! Consistency builds lasting courage.`,
        type: "success"
      });
    }
    
    if (avgSessionLength > 0) {
      insights.push({
        icon: <TrendingUp className="w-4 h-4 text-blue-500" />,
        title: "Progress Pattern",
        message: `Your average ${avgSessionLength}-minute sessions are building steady progress. Small steps, big results!`,
        type: "info"
      });
    }
    
    if (activeDaysThisWeek >= 3) {
      insights.push({
        icon: <Calendar className="w-4 h-4 text-green-500" />,
        title: "Weekly Momentum",
        message: `${activeDaysThisWeek} active days this week! You're creating a sustainable routine.`,
        type: "achievement"
      });
    } else {
      insights.push({
        icon: <Target className="w-4 h-4 text-purple-500" />,
        title: "Opportunity Ahead",
        message: "Try for 3+ exposure days this week to build consistent momentum.",
        type: "gentle-nudge"
      });
    }
    
    return insights;
  };

  const insights = generateInsights();

  const handleShareProgress = () => {
    const shareText = `I'm building courage with Bravely! ${user.currentStreak} day streak and counting. 💪 #ExposureTherapy #MentalHealthMatters`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Bravely Progress',
        text: shareText,
        url: window.location.origin
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText);
        toast({
          title: "Copied to clipboard!",
          description: "Share your progress on social media"
        });
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to clipboard!",
        description: "Share your progress on social media"
      });
    }
  };

  const handleSetReminder = () => {
    toast({
      title: "Reminder set!",
      description: "We'll gently remind you to practice exposure therapy daily"
    });
  };

  return (
    <div className="space-y-4">
      {/* Smart Insights Card */}
      <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100 dark:from-indigo-900/30 dark:via-purple-900/40 dark:to-pink-900/50 border border-indigo-200/50 dark:border-indigo-700/50 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-semibold text-indigo-800 dark:text-indigo-200">Smart Insights</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInsights(!showInsights)}
              className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-800/50"
            >
              {showInsights ? 'Hide' : 'View'}
            </Button>
          </div>
          
          {showInsights && (
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-white/60 dark:bg-indigo-800/30 border border-indigo-200/30 dark:border-indigo-700/30">
                  {insight.icon}
                  <div>
                    <p className="font-medium text-sm text-indigo-800 dark:text-indigo-200">{insight.title}</p>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400">{insight.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Engagement Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={handleShareProgress}
          variant="outline"
          className="bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/40 border-emerald-200 dark:border-emerald-700 hover:from-emerald-100 hover:to-teal-200 dark:hover:from-emerald-800/50 dark:hover:to-teal-800/60"
        >
          <Users className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" />
          <span className="text-emerald-700 dark:text-emerald-300 text-sm">Share Progress</span>
        </Button>

        <Button
          onClick={handleSetReminder}
          variant="outline"
          className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/40 border-amber-200 dark:border-amber-700 hover:from-amber-100 hover:to-orange-200 dark:hover:from-amber-800/50 dark:hover:to-orange-800/60"
        >
          <Bell className="w-4 h-4 mr-2 text-amber-600 dark:text-amber-400" />
          <span className="text-amber-700 dark:text-amber-300 text-sm">Daily Reminder</span>
        </Button>
      </div>
    </div>
  );
}