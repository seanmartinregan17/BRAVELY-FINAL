import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { Achievement, UserAchievement } from "@shared/schema";

interface AchievementNotificationProps {
  achievements: (UserAchievement & { achievement: Achievement })[];
  onDismiss: (id: number) => void;
  onDismissAll: () => void;
}

export default function AchievementNotification({ 
  achievements, 
  onDismiss, 
  onDismissAll 
}: AchievementNotificationProps) {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (achievements.length > 0) {
      setVisible(true);
      setCurrentIndex(0);
    }
  }, [achievements]);

  if (!visible || achievements.length === 0) {
    return null;
  }

  const currentAchievement = achievements[currentIndex];
  const achievement = currentAchievement.achievement;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'legendary': return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-amber-400 to-orange-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const handleNext = () => {
    if (currentIndex < achievements.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setVisible(false);
      onDismissAll();
    }
  };

  const handleDismiss = () => {
    onDismiss(currentAchievement.id);
    if (achievements.length === 1) {
      setVisible(false);
    } else {
      handleNext();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-sm mx-auto animate-in slide-in-from-bottom-4 duration-300">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <div className="text-2xl">🎉</div>
              <h3 className="font-bold text-lg">Achievement Unlocked!</h3>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleDismiss}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-center space-y-4">
            <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${getRarityGradient(achievement.rarity)} flex items-center justify-center text-4xl shadow-lg`}>
              {achievement.icon}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <h4 className="font-bold text-xl">{achievement.title}</h4>
                <Badge className={getRarityColor(achievement.rarity)}>
                  {achievement.rarity}
                </Badge>
              </div>
              
              <p className="text-muted-foreground text-sm">
                {achievement.description}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">+{achievement.xpReward}</div>
                  <div className="text-xs text-muted-foreground">XP Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {achievement.type === 'milestone' ? '📍' : 
                     achievement.type === 'badge' ? '🏅' : '🏆'}
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">{achievement.type}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-muted-foreground">
              {currentIndex + 1} of {achievements.length}
            </div>
            <div className="flex gap-2">
              {achievements.length > 1 && (
                <Button variant="outline" size="sm" onClick={onDismissAll}>
                  Skip All
                </Button>
              )}
              <Button size="sm" onClick={handleNext}>
                {currentIndex < achievements.length - 1 ? 'Next' : 'Awesome!'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}