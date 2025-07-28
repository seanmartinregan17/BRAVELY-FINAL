import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Target, TrendingUp, CheckCircle, Star, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ExposureItem {
  id: number;
  userId: number;
  title: string;
  description: string;
  fearLevel: number;
  difficulty: number;
  attempts: number;
  completed: boolean;
  position: number;
  createdAt: string;
}

interface ExposureHierarchyProps {
  user: any;
}

export default function ExposureHierarchy({ user }: ExposureHierarchyProps) {
  const [newExposure, setNewExposure] = useState({ title: "", description: "", fearLevel: 5, difficulty: 5 });
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: hierarchyItems = [], isLoading } = useQuery({
    queryKey: ["/api/exposure-hierarchy", user.id],
  });

  const addExposureMutation = useMutation({
    mutationFn: (exposureData: any) => apiRequest('POST', `/api/exposure-hierarchy/${user.id}`, exposureData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/exposure-hierarchy", user.id] });
      setNewExposure({ title: "", description: "", fearLevel: 5, difficulty: 5 });
      setIsAdding(false);
      toast({
        title: "Exposure added!",
        description: "Your hierarchy has been updated with the new exposure goal."
      });
    }
  });

  const updateExposureMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => apiRequest('PATCH', `/api/exposure-hierarchy/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/exposure-hierarchy", user.id] });
    }
  });

  const deleteExposureMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/exposure-hierarchy/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/exposure-hierarchy", user.id] });
      toast({
        title: "Exposure removed",
        description: "The exposure has been removed from your hierarchy."
      });
    }
  });

  const logAttemptMutation = useMutation({
    mutationFn: (id: number) => apiRequest('POST', `/api/exposure-hierarchy/${id}/attempt`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/exposure-hierarchy", user.id] });
      toast({
        title: "Attempt logged!",
        description: "Great job taking that brave step! Every attempt counts."
      });
    }
  });

  const markCompletedMutation = useMutation({
    mutationFn: (id: number) => apiRequest('POST', `/api/exposure-hierarchy/${id}/complete`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/exposure-hierarchy", user.id] });
      toast({
        title: "🎉 Exposure completed!",
        description: "Amazing! You've conquered this fear. Time to move up the hierarchy!"
      });
    }
  });

  const handleAddExposure = () => {
    if (!newExposure.title.trim()) return;
    
    addExposureMutation.mutate({
      ...newExposure,
      position: hierarchyItems.length
    });
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 3) return "bg-green-100 text-green-800 border-green-200";
    if (difficulty <= 6) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty <= 3) return "Easy";
    if (difficulty <= 6) return "Medium";
    return "Hard";
  };

  const getProgressPercentage = (attempts: number) => {
    const targetAttempts = 5; // CBT recommendation: 5+ exposures for habituation
    return Math.min((attempts / targetAttempts) * 100, 100);
  };

  // Sort items by difficulty (easier first) and position
  const sortedItems = [...hierarchyItems].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return a.difficulty - b.difficulty || a.position - b.position;
  });

  const completedCount = hierarchyItems.filter((item: ExposureItem) => item.completed).length;
  const totalItems = hierarchyItems.length;
  const overallProgress = totalItems > 0 ? (completedCount / totalItems) * 100 : 0;

  return (
    <Card className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-100 dark:from-purple-900/30 dark:via-indigo-900/40 dark:to-blue-900/50 border border-purple-200/50 dark:border-purple-700/50 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="font-semibold text-purple-800 dark:text-purple-200">Exposure Hierarchy</h3>
          </div>
          <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
            CBT-Based
          </Badge>
        </div>

        {/* Overall Progress */}
        {totalItems > 0 && (
          <div className="mb-4 p-3 bg-white/60 dark:bg-purple-800/30 rounded-lg border border-purple-200/30 dark:border-purple-700/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-purple-800 dark:text-purple-200">Hierarchy Progress</span>
              <span className="text-sm text-purple-600 dark:text-purple-400">{completedCount}/{totalItems} completed</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
            <p className="text-xs text-purple-700 dark:text-purple-300 mt-2">
              Building courage through gradual exposure. Start with easier challenges and work your way up.
            </p>
          </div>
        )}

        {/* Add New Exposure */}
        {!isAdding ? (
          <Button
            onClick={() => setIsAdding(true)}
            variant="outline"
            className="w-full mb-4 bg-white/60 dark:bg-purple-800/30 border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-800/50"
          >
            <Plus className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
            <span className="text-purple-700 dark:text-purple-300">Add Exposure Goal</span>
          </Button>
        ) : (
          <div className="mb-4 p-3 bg-white/80 dark:bg-purple-800/50 rounded-lg border border-purple-200 dark:border-purple-700">
            <div className="space-y-3">
              <Input
                placeholder="Exposure goal (e.g., 'Drive to the grocery store')"
                value={newExposure.title}
                onChange={(e) => setNewExposure({ ...newExposure, title: e.target.value })}
                className="bg-white dark:bg-purple-900/30"
              />
              <Textarea
                placeholder="Description or specific steps..."
                value={newExposure.description}
                onChange={(e) => setNewExposure({ ...newExposure, description: e.target.value })}
                className="bg-white dark:bg-purple-900/30 min-h-[60px]"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-purple-700 dark:text-purple-300 mb-1 block">Fear Level (1-10)</label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={newExposure.fearLevel}
                    onChange={(e) => setNewExposure({ ...newExposure, fearLevel: parseInt(e.target.value) || 5 })}
                    className="bg-white dark:bg-purple-900/30"
                  />
                </div>
                <div>
                  <label className="text-xs text-purple-700 dark:text-purple-300 mb-1 block">Difficulty (1-10)</label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={newExposure.difficulty}
                    onChange={(e) => setNewExposure({ ...newExposure, difficulty: parseInt(e.target.value) || 5 })}
                    className="bg-white dark:bg-purple-900/30"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={handleAddExposure}
                  disabled={addExposureMutation.isPending || !newExposure.title.trim()}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Add Goal
                </Button>
                <Button
                  onClick={() => {
                    setIsAdding(false);
                    setNewExposure({ title: "", description: "", fearLevel: 5, difficulty: 5 });
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Hierarchy Items */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-purple-600 dark:text-purple-400">Loading hierarchy...</p>
            </div>
          ) : sortedItems.length === 0 ? (
            <div className="text-center py-6">
              <Target className="w-12 h-12 text-purple-400 mx-auto mb-3" />
              <p className="text-purple-700 dark:text-purple-300 font-medium">Build Your Exposure Hierarchy</p>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                Start with easier challenges and gradually work up to bigger fears
              </p>
            </div>
          ) : (
            sortedItems.map((item: ExposureItem) => (
              <div 
                key={item.id} 
                className={`p-3 rounded-lg border transition-all ${
                  item.completed 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                    : 'bg-white/60 dark:bg-purple-800/30 border-purple-200/50 dark:border-purple-700/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className={`font-medium text-sm ${
                        item.completed ? 'text-green-800 dark:text-green-200 line-through' : 'text-purple-800 dark:text-purple-200'
                      }`}>
                        {item.title}
                      </h4>
                      {item.completed && <CheckCircle className="w-4 h-4 text-green-600" />}
                    </div>
                    {item.description && (
                      <p className="text-xs text-purple-600 dark:text-purple-400 mb-2">{item.description}</p>
                    )}
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getDifficultyColor(item.difficulty)}>
                        {getDifficultyLabel(item.difficulty)}
                      </Badge>
                      <span className="text-xs text-purple-600 dark:text-purple-400">
                        Fear: {item.fearLevel}/10
                      </span>
                      <span className="text-xs text-purple-600 dark:text-purple-400">
                        {item.attempts} attempts
                      </span>
                    </div>
                    {!item.completed && item.attempts > 0 && (
                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-purple-600 dark:text-purple-400 mb-1">
                          <span>Habituation Progress</span>
                          <span>{Math.min(item.attempts, 5)}/5 exposures</span>
                        </div>
                        <Progress value={getProgressPercentage(item.attempts)} className="h-1" />
                      </div>
                    )}
                  </div>
                </div>
                
                {!item.completed && (
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => logAttemptMutation.mutate(item.id)}
                      disabled={logAttemptMutation.isPending}
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 border-blue-200 dark:border-blue-700"
                    >
                      <TrendingUp className="w-3 h-3 mr-1 text-blue-600 dark:text-blue-400" />
                      <span className="text-blue-700 dark:text-blue-300 text-xs">Log Attempt</span>
                    </Button>
                    {item.attempts >= 3 && (
                      <Button
                        onClick={() => markCompletedMutation.mutate(item.id)}
                        disabled={markCompletedMutation.isPending}
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Star className="w-3 h-3 mr-1" />
                        <span className="text-xs">Mark Complete</span>
                      </Button>
                    )}
                  </div>
                )}
                
                {item.completed && (
                  <div className="text-center">
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      ✓ Conquered!
                    </Badge>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* CBT Tips */}
        <div className="mt-4 p-3 bg-purple-100 dark:bg-purple-800/50 rounded-lg border border-purple-200 dark:border-purple-700">
          <h4 className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2">📚 CBT Tip</h4>
          <p className="text-xs text-purple-700 dark:text-purple-300 leading-relaxed">
            Build your hierarchy from least to most anxiety-provoking. Start with exposures rated 3-4/10 for fear level. 
            Complete 3-5 successful attempts before moving to the next level. This gradual approach builds lasting confidence.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}