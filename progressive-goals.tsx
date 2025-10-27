import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Separator } from "@/components/ui/separator";
import { TrendingUp, Target, Brain, Settings, CheckCircle, AlertTriangle, Info, MapPin, Plus, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { AuthUser } from "@/lib/auth";

interface ProgressiveGoalsProps {
  user: AuthUser;
}

interface GoalRecommendation {
  newDistanceGoal: number;
  newDurationGoal: number;
  reasoning: string;
  encouragement: string;
  adjustedGrowthRate: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  riskAssessment: 'safe' | 'moderate' | 'challenging';
}

interface CustomSettings {
  goalGrowthRate: number;
  goalGrowthPeriod: string;
  currentDistanceGoal: number;
  currentDurationGoal: number;
}

export default function ProgressiveGoals({ user }: ProgressiveGoalsProps) {
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [customSettings, setCustomSettings] = useState<CustomSettings>({
    goalGrowthRate: 5.0,
    goalGrowthPeriod: 'weekly',
    currentDistanceGoal: 0.1,
    currentDurationGoal: 1
  });
  
  const [destinationGoals, setDestinationGoals] = useState<string[]>([]);
  const [newDestination, setNewDestination] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current progress data
  const { data: progressData, isLoading } = useQuery({
    queryKey: ['/api/progressive-goals', user.id],
  });

  // Generate new goal recommendations
  const generateGoalsMutation = useMutation({
    mutationFn: () => apiRequest('POST', `/api/progressive-goals/${user.id}/generate`),
    onSuccess: () => {
      setShowRecommendation(true);
      toast({
        title: "Goals Generated",
        description: "AI has analyzed your progress and created new recommendations.",
      });
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Could not generate recommendations. Please try again later.",
        variant: "destructive",
      });
    }
  });

  // Apply new goals
  const applyGoalsMutation = useMutation({
    mutationFn: (goals: { distanceGoal: number; durationGoal: number }) => 
      apiRequest('POST', `/api/progressive-goals/${user.id}/apply`, goals),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/progressive-goals', user.id] });
      queryClient.invalidateQueries({ queryKey: ['/api/today-stats', user.id] });
      setShowRecommendation(false);
      toast({
        title: "Goals Updated",
        description: "Your new progressive goals have been applied successfully.",
      });
    }
  });

  // Update settings
  const updateSettingsMutation = useMutation({
    mutationFn: (settings: CustomSettings & { destinationGoals: string[] }) => 
      apiRequest('PATCH', `/api/progressive-goals/${user.id}/settings`, settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/progressive-goals', user.id] });
      toast({
        title: "Settings Updated",
        description: "Your progressive goal preferences have been saved.",
      });
    }
  });

  useEffect(() => {
    if (progressData?.currentGoals) {
      setCustomSettings({
        goalGrowthRate: progressData.currentGoals.growthRate ?? 5.0,
        goalGrowthPeriod: progressData.currentGoals.growthPeriod ?? 'weekly',
        currentDistanceGoal: progressData.currentGoals.distanceGoal ?? 0.1,
        currentDurationGoal: progressData.currentGoals.durationGoal ?? 1
      });
    }
    if (progressData?.destinationGoals) {
      setDestinationGoals(progressData.destinationGoals);
    }
  }, [progressData]);

  const addDestinationGoal = () => {
    if (newDestination.trim() && !destinationGoals.includes(newDestination.trim())) {
      setDestinationGoals(prev => [...prev, newDestination.trim()]);
      setNewDestination('');
    }
  };

  const removeDestinationGoal = (destination: string) => {
    setDestinationGoals(prev => prev.filter(d => d !== destination));
  };

  const handleApplyRecommendation = (recommendation: GoalRecommendation) => {
    applyGoalsMutation.mutate({
      distanceGoal: recommendation.newDistanceGoal,
      durationGoal: recommendation.newDurationGoal
    });
  };

  const handleUpdateSettings = () => {
    updateSettingsMutation.mutate({
      ...customSettings,
      destinationGoals
    });
  };

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'safe': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'challenging': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2" />
          <p className="text-muted-foreground">Loading AI recommendations...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Unified Goals Card */}
      <Card className="bg-gradient-to-b from-violet-50 to-violet-100 dark:from-violet-900/30 dark:to-violet-900/50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-b from-violet-200 to-violet-300 dark:from-violet-800/50 dark:to-violet-900/50 rounded-full flex items-center justify-center">
              <Target className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            </div>
            <span className="text-violet-800 dark:text-violet-200">My Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Distance & Duration Goals */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-violet-700 dark:text-violet-300 uppercase tracking-wide">Session Targets</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-violet-600 dark:text-violet-400 font-medium">Distance (miles)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={customSettings.currentDistanceGoal}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow empty string during typing
                    if (value === '') {
                      setCustomSettings(prev => ({ ...prev, currentDistanceGoal: 0 }));
                    } else {
                      const numValue = parseFloat(value);
                      if (!isNaN(numValue)) {
                        setCustomSettings(prev => ({ ...prev, currentDistanceGoal: numValue }));
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const value = parseFloat(e.target.value);
                    if (isNaN(value) || value <= 0) {
                      setCustomSettings(prev => ({ ...prev, currentDistanceGoal: 0.1 }));
                    } else {
                      setCustomSettings(prev => ({ ...prev, currentDistanceGoal: value }));
                    }
                  }}
                  className="text-center font-medium"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-violet-600 dark:text-violet-400 font-medium">Duration (min)</Label>
                <Input
                  type="number"
                  step="1"
                  min="1"
                  value={customSettings.currentDurationGoal}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow empty string during typing
                    if (value === '') {
                      setCustomSettings(prev => ({ ...prev, currentDurationGoal: 0 }));
                    } else {
                      const numValue = parseInt(value, 10);
                      if (!isNaN(numValue)) {
                        setCustomSettings(prev => ({ ...prev, currentDurationGoal: numValue }));
                      }
                    }
                  }}
                  onBlur={(e) => {
                    const value = parseInt(e.target.value, 10);
                    if (isNaN(value) || value <= 0) {
                      setCustomSettings(prev => ({ ...prev, currentDurationGoal: 1 }));
                    } else {
                      setCustomSettings(prev => ({ ...prev, currentDurationGoal: value }));
                    }
                  }}
                  className="text-center font-medium"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Destination Goals */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-violet-700 dark:text-violet-300 uppercase tracking-wide flex items-center gap-2">
              <MapPin className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              Destination Targets
            </h4>
            <div className="flex gap-2">
              <Input
                placeholder="Add destination (e.g., grocery store, coffee shop)"
                value={newDestination}
                onChange={(e) => setNewDestination(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addDestinationGoal()}
                className="flex-1"
              />
              <Button 
                onClick={addDestinationGoal}
                disabled={!newDestination.trim()}
                size="icon"
                variant="outline"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {destinationGoals.length > 0 ? (
              <div className="grid grid-cols-1 gap-2">
                {destinationGoals.map((destination, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-md text-sm">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      {destination}
                    </span>
                    <Button
                      onClick={() => removeDestinationGoal(destination)}
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground text-sm py-2">
                Add places you'd like to visit during sessions
              </div>
            )}
          </div>

          <Separator />

          {/* Auto-Growth Settings */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-violet-700 dark:text-violet-300 uppercase tracking-wide flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              Growth Settings
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Growth Rate (%)</Label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={customSettings.goalGrowthRate}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value)) {
                      setCustomSettings(prev => ({ ...prev, goalGrowthRate: value }));
                    }
                  }}
                  className="text-center"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Growth Period</Label>
                <Select 
                  value={customSettings.goalGrowthPeriod} 
                  onValueChange={(value) => setCustomSettings(prev => ({ ...prev, goalGrowthPeriod: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleUpdateSettings}
            disabled={updateSettingsMutation.isPending}
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
          >
            {updateSettingsMutation.isPending ? "Saving..." : "Save All Goals"}
          </Button>
        </CardContent>
      </Card>

      {/* Smart Recommendations Section */}
      <Card className="bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:from-indigo-900/30 dark:via-blue-900/30 dark:to-cyan-900/30 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-semibold text-indigo-800 dark:text-indigo-200">
                Smart Recommendations
              </span>
              <p className="text-sm text-indigo-600 dark:text-indigo-400 font-normal">AI-powered goal optimization</p>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!showRecommendation ? (
            <div className="text-center space-y-4">
              <p className="text-indigo-700 dark:text-indigo-300 text-sm leading-relaxed">
                Get personalized goal suggestions based on your session history, progress patterns, and achievements.
              </p>
              <Button 
                onClick={() => generateGoalsMutation.mutate()}
                disabled={generateGoalsMutation.isPending}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium shadow-lg transition-all duration-200"
              >
                {generateGoalsMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Analyzing...
                  </span>
                ) : (
                  "Get Recommendations"
                )}
              </Button>
            </div>
          ) : (
            generateGoalsMutation.data && (
              <RecommendationDisplay
                recommendation={generateGoalsMutation.data}
                onApply={handleApplyRecommendation}
                onDiscard={() => setShowRecommendation(false)}
                isApplying={applyGoalsMutation.isPending}
              />
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface RecommendationDisplayProps {
  recommendation: GoalRecommendation;
  onApply: (rec: GoalRecommendation) => void;
  onDiscard: () => void;
  isApplying: boolean;
}

function RecommendationDisplay({ 
  recommendation, 
  onApply, 
  onDiscard, 
  isApplying 
}: RecommendationDisplayProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Badge className={getConfidenceColor(recommendation.confidenceLevel)}>
          {recommendation.confidenceLevel} confidence
        </Badge>
        <Badge variant="outline" className={getRiskColor(recommendation.riskAssessment)}>
          {recommendation.riskAssessment} challenge
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-bold text-primary">
            {recommendation?.newDistanceGoal?.toFixed(1) || 0} miles
          </div>
          <div className="text-xs text-muted-foreground">recommended distance</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-secondary">
            {recommendation?.newDurationGoal || 0} min
          </div>
          <div className="text-xs text-muted-foreground">recommended duration</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">AI Analysis:</p>
            <p className="text-sm text-muted-foreground">{recommendation.reasoning}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Encouragement:</p>
            <p className="text-sm text-muted-foreground">{recommendation.encouragement}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button 
          onClick={() => onApply(recommendation)}
          disabled={isApplying}
          className="flex-1"
        >
          {isApplying ? "Applying..." : "Apply Goals"}
        </Button>
        <Button 
          variant="outline" 
          onClick={onDiscard}
          className="flex-1"
        >
          Generate New
        </Button>
      </div>
    </div>
  );
}

function getConfidenceColor(level: string) {
  switch (level) {
    case 'high': return 'text-green-600 bg-green-100';
    case 'medium': return 'text-yellow-600 bg-yellow-100';
    case 'low': return 'text-orange-600 bg-orange-100';
    default: return 'text-gray-600 bg-gray-100';
  }
}

function getRiskColor(level: string) {
  switch (level) {
    case 'safe': return 'text-green-600';
    case 'moderate': return 'text-yellow-600';
    case 'challenging': return 'text-orange-600';
    default: return 'text-gray-600';
  }
}