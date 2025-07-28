import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Target, Clock, MapPin, Flame } from "lucide-react";
import type { AuthUser } from "@/lib/auth";

interface MicroAchievementsProps {
  user: AuthUser;
}

export default function MicroAchievements({ user }: MicroAchievementsProps) {
  const { data: sessions } = useQuery({
    queryKey: ["/api/sessions", user.id],
    enabled: !!user.id,
  });

  const { data: userProgress } = useQuery({
    queryKey: ["/api/user", user.id, "progress"],
    enabled: !!user.id,
  });

  // Calculate micro-achievements
  const calculateAchievements = () => {
    if (!sessions) return [];

    const achievements = [];
    const totalSessions = sessions.length;
    const thisWeekSessions = sessions.filter((session: any) => {
      const sessionDate = new Date(session.createdAt);
      const currentDate = new Date();
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - currentDate.getDay());
      return sessionDate >= weekStart && sessionDate <= currentDate;
    }).length;

    // First session milestone
    if (totalSessions >= 1) {
      achievements.push({
        title: "First Step",
        description: "Completed your first exposure session",
        icon: Target,
        color: "bg-emerald-500",
        earned: true
      });
    }

    // Weekly streak
    if (thisWeekSessions >= 3) {
      achievements.push({
        title: "Weekly Warrior",
        description: "3+ sessions this week",
        icon: Flame,
        color: "bg-orange-500",
        earned: true
      });
    }

    // Session milestone
    if (totalSessions >= 5) {
      achievements.push({
        title: "Momentum Builder",
        description: "Completed 5 exposure sessions",
        icon: Trophy,
        color: "bg-purple-500",
        earned: true
      });
    }

    // Duration milestone
    const totalDuration = sessions.reduce((sum: number, s: any) => sum + (s.duration || 0), 0);
    if (totalDuration >= 60) {
      achievements.push({
        title: "Hour of Courage",
        description: "60+ minutes of total exposure time",
        icon: Clock,
        color: "bg-blue-500",
        earned: true
      });
    }

    // Add next milestones to work toward
    if (totalSessions < 5) {
      achievements.push({
        title: "Momentum Builder",
        description: `${5 - totalSessions} more sessions to unlock`,
        icon: Trophy,
        color: "bg-gray-400",
        earned: false
      });
    }

    if (thisWeekSessions < 3) {
      achievements.push({
        title: "Weekly Warrior", 
        description: `${3 - thisWeekSessions} more sessions this week`,
        icon: Flame,
        color: "bg-gray-400",
        earned: false
      });
    }

    return achievements.slice(0, 3); // Show max 3
  };

  const achievements = calculateAchievements();

  if (achievements.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-3 flex items-center">
        <Star className="w-5 h-5 mr-2 text-yellow-500" />
        Recent Milestones
      </h2>
      <div className="grid grid-cols-1 gap-3">
        {achievements.map((achievement, index) => (
          <Card key={index} className={`transition-all ${achievement.earned ? 'shadow-md' : 'opacity-60'}`}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 ${achievement.color} rounded-full flex items-center justify-center`}>
                    <achievement.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-800">{achievement.title}</h3>
                    <p className="text-xs text-gray-600">{achievement.description}</p>
                  </div>
                </div>
                {achievement.earned && (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                    Earned!
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}