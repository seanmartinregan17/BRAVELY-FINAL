import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Lock, Star, Sparkles, Crown, Zap, Target, Calendar, Award, Trophy, Medal } from "lucide-react";
import type { AuthUser } from "@/lib/auth";
import type { Achievement, UserAchievement, UserProgress } from "@shared/schema";

interface AchievementDisplayProps {
  user: AuthUser;
  showProgress?: boolean;
  compact?: boolean;
}

interface AchievementWithStatus extends Achievement {
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
}

export default function AchievementDisplay({ user, showProgress = true, compact = false }: AchievementDisplayProps) {
  const { data: userProgress } = useQuery<UserProgress>({
    queryKey: [`/api/user/${user.id}/progress`],
  });

  const { data: userAchievements } = useQuery<UserAchievement[]>({
    queryKey: [`/api/user/${user.id}/achievements`],
  });

  const { data: allAchievements } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
  });

  if (!allAchievements || !userAchievements) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const unlockedIds = new Set(userAchievements.map(ua => ua.achievementId));
  const achievementsWithStatus: AchievementWithStatus[] = allAchievements.map(achievement => {
    const userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id);
    return {
      ...achievement,
      unlocked: unlockedIds.has(achievement.id),
      unlockedAt: userAchievement?.unlockedAt,
      progress: userAchievement?.progress || 0
    };
  });

  const getRarityInfo = (rarity: string) => {
    switch (rarity) {
      case 'common': 
        return {
          color: 'from-gray-400 to-gray-600',
          bgColor: 'bg-gray-50 dark:bg-gray-900',
          borderColor: 'border-gray-300 dark:border-gray-700',
          glow: 'shadow-gray-200 dark:shadow-gray-800',
          icon: Star
        };
      case 'rare': 
        return {
          color: 'from-blue-400 to-blue-600',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-300 dark:border-blue-700',
          glow: 'shadow-blue-200 dark:shadow-blue-800',
          icon: Sparkles
        };
      case 'epic': 
        return {
          color: 'from-purple-400 to-purple-600',
          bgColor: 'bg-purple-50 dark:bg-purple-900/20',
          borderColor: 'border-purple-300 dark:border-purple-700',
          glow: 'shadow-purple-200 dark:shadow-purple-800',
          icon: Crown
        };
      case 'legendary': 
        return {
          color: 'from-yellow-400 to-orange-500',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-300 dark:border-yellow-700',
          glow: 'shadow-yellow-200 dark:shadow-yellow-800',
          icon: Trophy
        };
      default: 
        return {
          color: 'from-gray-400 to-gray-600',
          bgColor: 'bg-gray-50 dark:bg-gray-900',
          borderColor: 'border-gray-300 dark:border-gray-700',
          glow: 'shadow-gray-200 dark:shadow-gray-800',
          icon: Star
        };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'milestone': return Target;
      case 'badge': return Medal;
      case 'trophy': return Trophy;
      case 'streak': return Zap;
      case 'special': return Award;
      default: return Star;
    }
  };

  const getLockedAchievementHint = (achievement: Achievement) => {
    // Create cryptic hints based on achievement criteria
    const hints = [
      "Complete your first brave step forward...",
      "Master the art of persistence...",
      "Discover strength in consistency...",
      "Unlock the power of dedication...",
      "Embrace the journey of growth...",
      "Find courage in the unknown...",
      "Achieve mastery through practice...",
      "Reveal your inner champion..."
    ];
    
    // Use achievement ID to consistently pick the same hint
    return hints[achievement.id % hints.length];
  };

  const calculateProgress = (achievement: Achievement): number => {
    if (!userProgress) return 0;
    
    const criteria = JSON.parse(achievement.criteria);
    
    switch (achievement.category) {
      case 'sessions':
        return Math.min(100, (userProgress.totalSessions / criteria.count) * 100);
      case 'distance':
        return Math.min(100, (userProgress.totalDistance / criteria.distance) * 100);
      case 'duration':
        return Math.min(100, (userProgress.totalDuration / criteria.duration) * 100);
      case 'streak':
        return Math.min(100, (userProgress.currentStreak / criteria.streak) * 100);
      case 'progress':
        return Math.min(100, (userProgress.currentLevel / criteria.level) * 100);
      default:
        return 0;
    }
  };

  const getProgressText = (achievement: Achievement): string => {
    if (!userProgress) return '';
    
    const criteria = JSON.parse(achievement.criteria);
    
    switch (achievement.category) {
      case 'sessions':
        return `${userProgress.totalSessions}/${criteria.count} sessions`;
      case 'distance':
        return `${userProgress.totalDistance.toFixed(1)}/${criteria.distance} miles`;
      case 'duration':
        return `${userProgress.totalDuration}/${criteria.duration} minutes`;
      case 'streak':
        return `${userProgress.currentStreak}/${criteria.streak} day streak`;
      case 'progress':
        return `Level ${userProgress.currentLevel}/${criteria.level}`;
      default:
        return '';
    }
  };

  const unlockedAchievements = achievementsWithStatus.filter(a => a.unlocked);
  const lockedAchievements = achievementsWithStatus.filter(a => !a.unlocked);
  
  // Dynamic display count - show more locked achievements as user progresses
  const getMaxDisplayCount = (unlockedCount: number) => {
    if (unlockedCount === 0) return 3; // Show only 3 when starting
    if (unlockedCount <= 2) return 4;  // Show 4 after first achievements
    if (unlockedCount <= 5) return 5;  // Show 5 after more progress
    return 6; // Show 6 for advanced users
  };
  
  const maxLockedToShow = getMaxDisplayCount(unlockedAchievements.length);

  // Video game style achievement component
  const AchievementCard = ({ achievement, index, isLocked }: { achievement: AchievementWithStatus; index?: number; isLocked?: boolean }) => {
    const rarityInfo = getRarityInfo(achievement.rarity);
    const TypeIconComponent = getTypeIcon(achievement.type);
    const RarityIconComponent = rarityInfo.icon;
    const progress = calculateProgress(achievement);
    const progressText = getProgressText(achievement);

    // Calculate fade effect for distant locked achievements
    const shouldFade = isLocked && typeof index === 'number' && index >= 2;
    const fadeOpacity = shouldFade ? Math.max(0.3, 1 - (index - 1) * 0.15) : 1;
    const isDistant = shouldFade && index >= 4;

    if (!achievement.unlocked) {
      // Locked achievement - mystery style with fade effect
      return (
        <Card 
          className={`relative overflow-hidden transition-all duration-300 ${!isDistant ? 'hover:scale-[1.02]' : ''} cursor-pointer border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 ${isDistant ? 'blur-sm' : ''}`}
          style={{ opacity: fadeOpacity }}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              {/* Mystery Icon */}
              <div className="relative">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center border border-gray-300 dark:border-gray-700">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center">
                  <span className="text-xs text-white">?</span>
                </div>
              </div>
              
              {/* Mystery Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-400 dark:text-gray-500">??? ??? ???</h3>
                  <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-700 text-gray-500">
                    {achievement.rarity.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  {isDistant ? "Distant secrets await..." : getLockedAchievementHint(achievement)}
                </p>
                {progress > 0 && !isDistant && (
                  <div className="space-y-1 mt-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Unlocked achievement - full glory
    return (
      <Card className={`relative overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer border-2 ${rarityInfo.borderColor} ${rarityInfo.bgColor} shadow-lg`}>
        <div className={`absolute inset-0 bg-gradient-to-r ${rarityInfo.color} opacity-5`}></div>
        {achievement.rarity === 'legendary' && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-yellow-400/10 to-orange-500/10"></div>
        )}
        <CardContent className="relative p-4">
          <div className="flex items-center space-x-3">
            {/* Achievement Icon */}
            <div className="relative">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${rarityInfo.color} flex items-center justify-center shadow-md`}>
                <TypeIconComponent className="w-6 h-6 text-white" />
              </div>
              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r ${rarityInfo.color} flex items-center justify-center border border-white/50`}>
                <RarityIconComponent className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            
            {/* Achievement Details */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground">{achievement.title}</h3>
                <Badge variant="secondary" className="text-xs">
                  {achievement.rarity.toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                {achievement.description}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Unlocked {achievement.unlockedAt ? new Date(achievement.unlockedAt).toLocaleDateString() : 'Recently'}
                </span>
                <span className="font-medium text-primary">
                  +{achievement.xpReward} XP
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (compact) {
    return (
      <div className="space-y-4">
        {showProgress && userProgress && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">Level {userProgress.currentLevel}</div>
                  <div className="text-muted-foreground">{userProgress.totalXp} XP</div>
                </div>
                <div>
                  <div className="font-medium">{userProgress.currentStreak} day streak</div>
                  <div className="text-muted-foreground">{userProgress.totalSessions} sessions</div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Level Progress</span>
                  <span>{userProgress.totalXp - userProgress.currentLevel * 100}/{(userProgress.currentLevel + 1) * 100 - userProgress.currentLevel * 100} XP</span>
                </div>
                <Progress value={((userProgress.totalXp - userProgress.currentLevel * 100) / ((userProgress.currentLevel + 1) * 100 - userProgress.currentLevel * 100)) * 100} />
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {unlockedAchievements.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">
                Complete your first session to unlock achievements!
              </p>
            ) : (
              <div className="space-y-3">
                {unlockedAchievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{achievement.title}</div>
                      <div className="text-xs text-muted-foreground">{achievement.description}</div>
                    </div>
                    <Badge variant="secondary" className={getRarityInfo(achievement.rarity).borderColor}>
                      +{achievement.xpReward} XP
                    </Badge>
                  </div>
                ))}
                {unlockedAchievements.length > 3 && (
                  <div className="text-center text-sm text-muted-foreground">
                    +{unlockedAchievements.length - 3} more achievements
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showProgress && userProgress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">Level {userProgress.currentLevel}</div>
                <div className="text-sm text-blue-600">{userProgress.totalXp} XP</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{userProgress.currentStreak}</div>
                <div className="text-sm text-orange-600">Day Streak</div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold">{userProgress.totalSessions}</div>
                <div className="text-sm text-muted-foreground">Sessions</div>
              </div>
              <div>
                <div className="text-lg font-semibold">{userProgress.totalDistance.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">Miles</div>
              </div>
              <div>
                <div className="text-lg font-semibold">{Math.floor(userProgress.totalDuration / 60)}h {userProgress.totalDuration % 60}m</div>
                <div className="text-sm text-muted-foreground">Total Time</div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Next Level Progress</span>
                <span>Level {userProgress.currentLevel + 1}</span>
              </div>
              <Progress value={((userProgress.totalXp - userProgress.currentLevel * 100) / ((userProgress.currentLevel + 1) * 100 - userProgress.currentLevel * 100)) * 100} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Video Game Style Achievement Gallery */}
      <div className="space-y-6">
        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-foreground">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Unlocked Achievements ({unlockedAchievements.length})
            </h2>
            <div className="space-y-3">
              {unlockedAchievements.map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </div>
          </div>
        )}

        {/* Locked Achievements - Limited Mystery Section */}
        {lockedAchievements.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-foreground">
              <Lock className="w-5 h-5 text-gray-500" />
              Achievements to Unlock ({Math.min(maxLockedToShow, lockedAchievements.length)})
            </h2>
            <div className="space-y-3">
              {lockedAchievements.slice(0, maxLockedToShow).map((achievement, index) => (
                <AchievementCard 
                  key={achievement.id} 
                  achievement={achievement} 
                  index={index}
                  isLocked={true}
                />
              ))}
              {lockedAchievements.length > maxLockedToShow && (
                <div className="text-center py-4">
                  <div className="text-sm text-muted-foreground mb-2">
                    {lockedAchievements.length - maxLockedToShow} more secrets await discovery...
                  </div>
                  <div className="flex justify-center space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* No Achievements State */}
        {unlockedAchievements.length === 0 && lockedAchievements.length === 0 && (
          <Card className="border-dashed border-2 border-gray-300 dark:border-gray-700">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Achievements Yet</h3>
              <p className="text-muted-foreground text-sm">
                Complete your first exposure therapy session to unlock your journey of achievements!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}