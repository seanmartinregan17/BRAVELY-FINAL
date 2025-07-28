import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Award, Calendar } from "lucide-react";
import type { AuthUser } from "@/lib/auth";

interface WeeklyProgressModalProps {
  user: AuthUser;
  isOpen: boolean;
  onClose: () => void;
}

export default function WeeklyProgressModal({ user, isOpen, onClose }: WeeklyProgressModalProps) {
  const { data: sessions = [] } = useQuery({
    queryKey: ["/api/sessions", user.id],
  });

  const { data: weeklyStats = [] } = useQuery({
    queryKey: ["/api/weekly-stats", user.id],
  });

  // Calculate this week's stats
  const thisWeekSessions = sessions.filter((session: any) => {
    const sessionDate = new Date(session.startTime);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return sessionDate > weekAgo;
  });

  const totalSessions = thisWeekSessions.length;
  const totalDistance = thisWeekSessions.reduce((sum: number, session: any) => 
    sum + (session.distance || 0), 0
  ).toFixed(1);
  
  const longestStreak = user.longestStreak || 0;
  const currentStreak = user.currentStreak || 0;

  const getMotivationalMessage = () => {
    if (totalSessions >= 5) return "You're making incredible progress! Bravery is becoming a habit. 🏆";
    if (totalSessions >= 3) return "Fantastic work this week! Your consistency is building real courage. 💪";
    if (totalSessions >= 1) return "Great start! Every session is a step toward greater confidence. 🌟";
    return "This week is a fresh start. When you're ready, take that first brave step. 💙";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Your Weekly Progress
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {totalSessions}
                </div>
                <div className="text-xs text-blue-800 dark:text-blue-200">
                  Sessions This Week
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {totalDistance}
                </div>
                <div className="text-xs text-green-800 dark:text-green-200">
                  Miles Covered
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {currentStreak}
                </div>
                <div className="text-xs text-purple-800 dark:text-purple-200">
                  Current Streak
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {longestStreak}
                </div>
                <div className="text-xs text-amber-800 dark:text-amber-200">
                  Longest Streak
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Level */}
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span className="font-medium text-indigo-900 dark:text-indigo-100">
                  Progress Level
                </span>
              </div>
              <div className="flex items-center gap-2">
                {totalSessions >= 5 && <Badge className="bg-green-600">Champion</Badge>}
                {totalSessions >= 3 && totalSessions < 5 && <Badge className="bg-blue-600">Consistent</Badge>}
                {totalSessions >= 1 && totalSessions < 3 && <Badge className="bg-purple-600">Getting Started</Badge>}
                {totalSessions === 0 && <Badge variant="outline">Ready to Begin</Badge>}
              </div>
            </CardContent>
          </Card>

          {/* Motivational Message */}
          <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 border-teal-200 dark:border-teal-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-teal-600 dark:text-teal-400 mt-0.5" />
                <p className="text-sm text-teal-800 dark:text-teal-200 font-medium">
                  {getMotivationalMessage()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}