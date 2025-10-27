import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, MapPin, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface ZoneExpansionChartProps {
  user: any;
}

export default function ZoneExpansionChart({ user }: ZoneExpansionChartProps) {
  const { data: sessions = [] } = useQuery({
    queryKey: ["/api/sessions", user.id],
  });

  const { data: weeklyStats = [] } = useQuery({
    queryKey: ["/api/weekly-stats", user.id],
  });

  // Calculate zone expansion metrics
  const calculateZoneExpansion = () => {
    if (!sessions || sessions.length === 0) {
      return {
        totalDistance: 0,
        uniqueLocations: 0,
        weeklyGrowth: [],
        expansionTrend: "stable"
      };
    }

    // Sort sessions by date
    const sortedSessions = [...sessions].sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    // Calculate total distance covered
    const totalDistance = sessions.reduce((sum: number, session: any) => sum + (session.distance || 0), 0);

    // Estimate unique locations (rough calculation based on session variety)
    const uniqueLocations = Math.min(sessions.length, Math.ceil(sessions.length * 0.7));

    // Calculate weekly growth
    const now = new Date();
    const weeklyGrowth = [];
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7 + now.getDay()));
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const weekSessions = sessions.filter((session: any) => {
        const sessionDate = new Date(session.startTime);
        return sessionDate >= weekStart && sessionDate <= weekEnd;
      });

      const weekDistance = weekSessions.reduce((sum: number, session: any) => sum + (session.distance || 0), 0);
      const weekLocations = Math.min(weekSessions.length, Math.ceil(weekSessions.length * 0.7));

      weeklyGrowth.push({
        week: `Week ${4 - i}`,
        distance: weekDistance,
        locations: weekLocations,
        sessions: weekSessions.length
      });
    }

    // Determine expansion trend
    const recentWeeks = weeklyGrowth.slice(-2);
    let expansionTrend = "stable";
    if (recentWeeks.length === 2) {
      if (recentWeeks[1].distance > recentWeeks[0].distance * 1.2) {
        expansionTrend = "expanding";
      } else if (recentWeeks[1].distance < recentWeeks[0].distance * 0.8) {
        expansionTrend = "contracting";
      }
    }

    return {
      totalDistance: totalDistance / 1000, // Convert to miles
      uniqueLocations,
      weeklyGrowth,
      expansionTrend
    };
  };

  const zoneData = calculateZoneExpansion();
  const maxWeeklyDistance = Math.max(...zoneData.weeklyGrowth.map(w => w.distance), 1);

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "expanding": return "text-green-600 bg-green-100 border-green-200";
      case "contracting": return "text-orange-600 bg-orange-100 border-orange-200";
      default: return "text-blue-600 bg-blue-100 border-blue-200";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "expanding": return "📈";
      case "contracting": return "📉";
      default: return "📊";
    }
  };

  return (
    <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 dark:from-green-900/30 dark:via-emerald-900/40 dark:to-teal-900/50 border border-green-200/50 dark:border-green-700/50 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h3 className="font-semibold text-green-800 dark:text-green-200">Zone Expansion</h3>
          </div>
          <Badge className={getTrendColor(zoneData.expansionTrend)}>
            {getTrendIcon(zoneData.expansionTrend)} {zoneData.expansionTrend}
          </Badge>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 bg-white/60 dark:bg-green-800/30 rounded-lg border border-green-200/30 dark:border-green-700/30">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{zoneData.totalDistance.toFixed(1)}</p>
            <p className="text-xs text-green-700 dark:text-green-300">Miles Explored</p>
          </div>
          <div className="text-center p-3 bg-white/60 dark:bg-green-800/30 rounded-lg border border-green-200/30 dark:border-green-700/30">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{zoneData.uniqueLocations}</p>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">New Places</p>
          </div>
          <div className="text-center p-3 bg-white/60 dark:bg-green-800/30 rounded-lg border border-green-200/30 dark:border-green-700/30">
            <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{sessions.length}</p>
            <p className="text-xs text-teal-700 dark:text-teal-300">Total Sessions</p>
          </div>
        </div>

        {/* Weekly Growth Chart */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
            <h4 className="text-sm font-medium text-green-800 dark:text-green-200">Weekly Progress</h4>
          </div>
          
          {zoneData.weeklyGrowth.length > 0 ? (
            <div className="space-y-3">
              {zoneData.weeklyGrowth.map((week, index) => {
                const distanceKm = week.distance;
                const widthPercentage = maxWeeklyDistance > 0 ? (distanceKm / maxWeeklyDistance) * 100 : 0;
                
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="text-xs text-green-700 dark:text-green-300 w-12">{week.week}</span>
                    <div className="flex-1 bg-green-200 dark:bg-green-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(widthPercentage, 2)}%` }}
                      />
                    </div>
                    <div className="text-right w-20">
                      <span className="text-xs font-medium text-green-700 dark:text-green-300">
                        {(distanceKm / 1000).toFixed(1)}mi
                      </span>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        {week.sessions} sessions
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4">
              <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-green-600 dark:text-green-400">Start your first session to see zone expansion!</p>
            </div>
          )}
        </div>

        {/* Expansion Insights */}
        <div className="p-3 bg-green-100 dark:bg-green-800/50 rounded-lg border border-green-200 dark:border-green-700">
          <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">🌱 Growth Insight</h4>
          <p className="text-xs text-green-700 dark:text-green-300 leading-relaxed">
            {zoneData.expansionTrend === "expanding" && 
              "Your comfort zone is expanding! You're exploring new areas and building confidence. Keep pushing those boundaries."}
            {zoneData.expansionTrend === "contracting" && 
              "Your zone has contracted recently. That's normal - some weeks we need to consolidate gains. Try a familiar challenge to rebuild momentum."}
            {zoneData.expansionTrend === "stable" && 
              "You're maintaining steady progress. Consider gradually increasing distance or trying new locations to continue growing your comfort zone."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}