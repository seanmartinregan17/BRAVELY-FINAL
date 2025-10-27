import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, MapPin, Clock, Target } from "lucide-react";
import type { AuthUser } from "@/lib/auth";

interface SmartRecommendationsProps {
  user: AuthUser;
}

export default function SmartRecommendations({ user }: SmartRecommendationsProps) {
  const { data: sessions } = useQuery({
    queryKey: ["/api/sessions", user.id],
    enabled: !!user.id,
  });

  const { data: todayStats } = useQuery({
    queryKey: ["/api/today-stats", user.id],
    enabled: !!user.id,
  });

  // Generate smart recommendations based on user data
  const generateRecommendations = () => {
    const recommendations = [];
    
    if (!sessions || sessions.length === 0) {
      recommendations.push({
        title: "Take Your First Brave Step",
        description: "Start with a 5-minute session to somewhere familiar",
        icon: Target,
        action: "Start Session",
        color: "from-emerald-500 to-teal-500"
      });
    } else {
      const lastSession = sessions[0];
      const avgDuration = sessions.reduce((sum: number, s: any) => sum + (s.duration || 0), 0) / sessions.length;
      
      if (avgDuration < 10) {
        recommendations.push({
          title: "Extend Your Comfort Zone",
          description: `Try a ${Math.ceil(avgDuration + 3)}-minute session this time`,
          icon: Clock,
          action: "Start Session",
          color: "from-blue-500 to-indigo-500"
        });
      }
      
      if (sessions.length >= 3) {
        recommendations.push({
          title: "Explore a New Route",
          description: "Visit a place you've never driven to before",
          icon: MapPin,
          action: "Start Session", 
          color: "from-purple-500 to-pink-500"
        });
      }
    }

    if (todayStats && todayStats.duration === 0) {
      recommendations.push({
        title: "Keep Your Streak Alive",
        description: "Even 5 minutes today counts as progress",
        icon: Target,
        action: "Start Session",
        color: "from-orange-500 to-amber-500"
      });
    }

    return recommendations.slice(0, 2); // Show max 2 recommendations
  };

  const recommendations = generateRecommendations();

  if (recommendations.length === 0) return null;

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-3 flex items-center">
        <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
        Smart Suggestions
      </h2>
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 bg-gradient-to-r ${rec.color} rounded-full flex items-center justify-center`}>
                    <rec.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-800">{rec.title}</h3>
                    <p className="text-xs text-gray-600">{rec.description}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs"
                  onClick={() => {
                    // Trigger session start modal
                    const startButton = document.querySelector('[data-start-session]') as HTMLButtonElement;
                    if (startButton) startButton.click();
                  }}
                >
                  Try Now →
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}