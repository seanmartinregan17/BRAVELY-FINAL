import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Target, Clock, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface LocationBasedNudgesProps {
  user: any;
  currentLocation?: { latitude: number; longitude: number };
}

interface LocationMemory {
  id: number;
  userId: number;
  latitude: number;
  longitude: number;
  locationName: string;
  sessionType: string;
  fearLevelBefore: number;
  fearLevelAfter: number;
  createdAt: string;
  distance?: number;
}

export default function LocationBasedNudges({ user, currentLocation }: LocationBasedNudgesProps) {
  const [nearbyMemories, setNearbyMemories] = useState<LocationMemory[]>([]);
  const [activeNudge, setActiveNudge] = useState<any>(null);
  const [nudgeType, setNudgeType] = useState<string>("");
  const { toast } = useToast();

  const { data: sessions = [] } = useQuery({
    queryKey: ["/api/sessions", user.id],
  });

  const { data: progressData } = useQuery({
    queryKey: ["/api/progressive-goals", user.id],
  });

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  // Find location-based opportunities
  useEffect(() => {
    if (!currentLocation || !sessions.length) return;

    const memories: LocationMemory[] = [];
    const nearby: LocationMemory[] = [];
    
    // Process session data to create location memories
    sessions.forEach((session: any) => {
      if (session.startLatitude && session.startLongitude) {
        const distance = calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          session.startLatitude,
          session.startLongitude
        );

        const memory: LocationMemory = {
          id: session.id,
          userId: user.id,
          latitude: session.startLatitude,
          longitude: session.startLongitude,
          locationName: session.locationName || "Previous location",
          sessionType: session.sessionType,
          fearLevelBefore: session.fearLevelBefore,
          fearLevelAfter: session.fearLevelAfter || session.fearLevelBefore,
          createdAt: session.startTime,
          distance: distance
        };

        memories.push(memory);

        // Within 0.5km is considered "nearby"
        if (distance <= 0.5) {
          nearby.push(memory);
        }
      }
    });

    setNearbyMemories(nearby);
    
    // Generate appropriate nudge
    if (nearby.length > 0) {
      generateLocationNudge(nearby);
    } else {
      generateProgressNudge();
    }
  }, [currentLocation, sessions, progressData]);

  const generateLocationNudge = (nearbyMemories: LocationMemory[]) => {
    const recentMemory = nearbyMemories.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];

    const daysSinceLastVisit = Math.floor(
      (Date.now() - new Date(recentMemory.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    let nudgeMessage = "";
    let nudgeAction = "";
    let nudgeIcon = "🗺️";
    let type = "location-revisit";

    if (daysSinceLastVisit <= 1) {
      nudgeMessage = `You're back at ${recentMemory.locationName}! This familiar spot might be perfect for building on yesterday's progress.`;
      nudgeAction = "Continue Building Confidence";
      nudgeIcon = "🔄";
      type = "recent-success";
    } else if (daysSinceLastVisit <= 7) {
      nudgeMessage = `Welcome back to ${recentMemory.locationName}! Last time you were here, you reduced your fear from ${recentMemory.fearLevelBefore} to ${recentMemory.fearLevelAfter}.`;
      nudgeAction = "Try Another Challenge Here";
      nudgeIcon = "⭐";
      type = "milestone-revisit";
    } else if (daysSinceLastVisit <= 30) {
      nudgeMessage = `You're near ${recentMemory.locationName} - a place where you've grown before. Ready to see how much stronger you've become?`;
      nudgeAction = "Test Your Growth";
      nudgeIcon = "📈";
      type = "growth-check";
    } else {
      nudgeMessage = `You're back at ${recentMemory.locationName} after ${daysSinceLastVisit} days! This could be a great place to reconnect with your courage journey.`;
      nudgeAction = "Reconnect with Progress";
      nudgeIcon = "🌱";
      type = "reconnection";
    }

    setActiveNudge({
      message: nudgeMessage,
      action: nudgeAction,
      icon: nudgeIcon,
      location: recentMemory,
      confidence: calculateConfidenceBoost(recentMemory)
    });
    setNudgeType(type);
  };

  const generateProgressNudge = () => {
    const currentGoals = progressData?.currentGoals;
    if (!currentGoals) return;

    const today = new Date();
    const recentSessions = sessions.filter((session: any) => {
      const sessionDate = new Date(session.startTime);
      const daysDiff = (today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    });

    if (recentSessions.length === 0) {
      setActiveNudge({
        message: "It's been a while since your last session. Even a small step counts - maybe just a short walk around the block?",
        action: "Take a Small Step",
        icon: "🚶",
        type: "gentle-return"
      });
    } else if (recentSessions.length >= 3) {
      setActiveNudge({
        message: `You've had ${recentSessions.length} sessions this week! You're building real momentum. Ready to try something slightly more challenging?`,
        action: "Level Up Challenge",
        icon: "🚀",
        type: "momentum-boost"
      });
    } else {
      setActiveNudge({
        message: "You're doing great with your exposure practice! Every session builds courage. How about another step forward today?",
        action: "Continue Building",
        icon: "💪",
        type: "encouragement"
      });
    }
    setNudgeType("progress");
  };

  const calculateConfidenceBoost = (memory: LocationMemory): number => {
    const fearReduction = memory.fearLevelBefore - memory.fearLevelAfter;
    const daysSince = Math.floor(
      (Date.now() - new Date(memory.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    // Base confidence from previous success
    let confidence = Math.max(20, 50 + (fearReduction * 10));
    
    // Boost for recent successes
    if (daysSince <= 3) confidence += 20;
    else if (daysSince <= 7) confidence += 10;
    
    return Math.min(confidence, 95);
  };

  const handleAcceptNudge = () => {
    toast({
      title: "Great choice!",
      description: "Starting a new session to build on your progress."
    });
    
    // This would typically trigger the session start modal
    // For now, we'll just show success feedback
    setActiveNudge(null);
  };

  const handleDismissNudge = () => {
    toast({
      title: "No worries!",
      description: "The opportunity will be here when you're ready."
    });
    setActiveNudge(null);
  };

  if (!activeNudge) {
    return null;
  }

  const getNudgeColor = (type: string) => {
    switch (type) {
      case "recent-success": return "from-green-50 to-emerald-100 border-green-200";
      case "milestone-revisit": return "from-blue-50 to-indigo-100 border-blue-200";
      case "growth-check": return "from-purple-50 to-violet-100 border-purple-200";
      case "reconnection": return "from-amber-50 to-yellow-100 border-amber-200";
      default: return "from-teal-50 to-cyan-100 border-teal-200";
    }
  };

  return (
    <Card className={`bg-gradient-to-br ${getNudgeColor(nudgeType)} dark:from-slate-800/30 dark:to-slate-900/50 border ${getNudgeColor(nudgeType).split(' ')[2]} dark:border-slate-700/50 shadow-lg animate-pulse-gentle`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="text-2xl">{activeNudge.icon}</div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                Location Opportunity
              </h3>
              {activeNudge.confidence && (
                <Badge variant="secondary" className="mt-1">
                  {activeNudge.confidence}% confidence boost
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Navigation className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <MapPin className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          </div>
        </div>

        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
          {activeNudge.message}
        </p>

        {activeNudge.location && (
          <div className="mb-4 p-2 bg-white/50 dark:bg-slate-800/50 rounded border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Previous session: {activeNudge.location.sessionType}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Fear level: {activeNudge.location.fearLevelBefore} → {activeNudge.location.fearLevelAfter}
                </p>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {Math.round(activeNudge.location.distance * 1000)}m away
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <Button
            onClick={handleAcceptNudge}
            className="flex-1 bg-slate-700 hover:bg-slate-800 text-white"
            size="sm"
          >
            <Target className="w-3 h-3 mr-1" />
            {activeNudge.action}
          </Button>
          <Button
            onClick={handleDismissNudge}
            variant="outline"
            size="sm"
            className="px-3"
          >
            Later
          </Button>
        </div>

        <div className="mt-3 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Smart nudges based on your location and progress history
          </p>
        </div>
      </CardContent>
    </Card>
  );
}