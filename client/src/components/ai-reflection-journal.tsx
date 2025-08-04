import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Sparkles, Heart, Calendar, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface JournalEntry {
  id: number;
  userId: number;
  prompt: string;
  response: string;
  aiInsight: string;
  createdAt: string;
  mood: number;
}

interface AIReflectionJournalProps {
  user: any;
}

const reflectionPrompts = [
  "What was one moment today when you felt proud of your courage?",
  "Describe a situation that challenged you this week. How did you handle it?",
  "What would you say to someone facing the same fears you overcame today?",
  "How has your comfort zone grown in the past month?",
  "What unexpected strength did you discover about yourself recently?",
  "When did you last feel truly present and calm? What made that possible?",
  "What small step could you take tomorrow to continue building courage?",
  "How do you celebrate your progress, even the tiny victories?",
  "What patterns do you notice in your thoughts when anxiety arises?",
  "Describe a place or activity that makes you feel safe and grounded."
];

export default function AIReflectionJournal({ user }: AIReflectionJournalProps) {
  const [currentEntry, setCurrentEntry] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [mood, setMood] = useState(5);
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["/api/journal", user.id],
  });

  const { data: todayPrompt } = useQuery({
    queryKey: ["/api/journal/daily-prompt"],
    staleTime: 12 * 60 * 60 * 1000, // 12 hours
  });

  const saveEntryMutation = useMutation({
    mutationFn: (entryData: any) => apiRequest('POST', `/api/journal/${user.id}`, entryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal", user.id] });
      setCurrentEntry("");
      setSelectedPrompt("");
      toast({
        title: "Reflection saved",
        description: "Your thoughts have been securely stored in your private journal."
      });
    }
  });

  const generateInsightMutation = useMutation({
    mutationFn: (entryData: { prompt: string; response: string; mood: number }) => 
      apiRequest('POST', `/api/journal/ai-insight`, entryData),
    onSuccess: (data) => {
      // Add the insight to the entry and save
      saveEntryMutation.mutate({
        prompt: selectedPrompt,
        response: currentEntry,
        mood: mood,
        aiInsight: data.insight
      });
    },
    onError: () => {
      // Save without AI insight if it fails
      saveEntryMutation.mutate({
        prompt: selectedPrompt,
        response: currentEntry,
        mood: mood,
        aiInsight: ""
      });
    }
  });

  useEffect(() => {
    if (todayPrompt && !selectedPrompt) {
      setSelectedPrompt(todayPrompt.prompt);
    }
  }, [todayPrompt, selectedPrompt]);

  const handleSaveEntry = async () => {
    if (!currentEntry.trim() || !selectedPrompt) return;

    setIsGeneratingInsight(true);
    
    try {
      // Try to generate AI insight
      await generateInsightMutation.mutateAsync({
        prompt: selectedPrompt,
        response: currentEntry,
        mood: mood
      });
    } catch (error) {
      // Fallback: save without AI insight
      saveEntryMutation.mutate({
        prompt: selectedPrompt,
        response: currentEntry,
        mood: mood,
        aiInsight: ""
      });
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  const selectRandomPrompt = () => {
    const availablePrompts = reflectionPrompts.filter(p => p !== selectedPrompt);
    const randomPrompt = availablePrompts[Math.floor(Math.random() * availablePrompts.length)];
    setSelectedPrompt(randomPrompt);
  };

  const recentEntries = entries.slice(0, 3);
  const hasEntryToday = entries.some((entry: JournalEntry) => {
    const entryDate = new Date(entry.createdAt).toDateString();
    const today = new Date().toDateString();
    return entryDate === today;
  });

  return (
    <Card className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100 dark:from-amber-900/30 dark:via-yellow-900/40 dark:to-orange-900/50 border border-amber-200/50 dark:border-amber-700/50 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-semibold text-amber-800 dark:text-amber-200">Reflection Journal</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300">
              Private
            </Badge>
          </div>
        </div>

        {/* Today's Prompt */}
        <div className="mb-4 p-3 bg-white/60 dark:bg-amber-800/30 rounded-lg border border-amber-200/30 dark:border-amber-700/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-amber-800 dark:text-amber-200">Today's Reflection</span>
            {hasEntryToday && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                ✓ Completed
              </Badge>
            )}
          </div>
          
          {!hasEntryToday ? (
            <div className="space-y-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-800/50 rounded border border-amber-200 dark:border-amber-700">
                <p className="text-sm text-amber-800 dark:text-amber-200 italic">"{selectedPrompt}"</p>
              </div>
              
              <Button
                onClick={selectRandomPrompt}
                variant="ghost"
                size="sm"
                className="text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-800/50"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                New Prompt
              </Button>

              <Textarea
                placeholder="Take your time... there's no wrong answer. This is your space to reflect and grow."
                value={currentEntry}
                onChange={(e) => setCurrentEntry(e.target.value)}
                className="bg-white dark:bg-amber-900/30 border-amber-200 dark:border-amber-700 min-h-[100px] resize-none"
              />

              <div className="flex items-center space-x-3">
                <span className="text-xs text-amber-700 dark:text-amber-300">How are you feeling?</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMood(rating)}
                      className={`text-lg transition-all ${
                        mood >= rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'
                      }`}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleSaveEntry}
                disabled={!currentEntry.trim() || isGeneratingInsight || saveEntryMutation.isPending}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              >
                {isGeneratingInsight ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Generating Insight...
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 mr-2" />
                    Save Reflection
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="text-center py-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-2">
                <Heart className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                You've completed today's reflection. Well done on taking time for self-care!
              </p>
            </div>
          )}
        </div>

        {/* Recent Entries */}
        {recentEntries.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-medium text-amber-800 dark:text-amber-200">Recent Reflections</span>
            </div>
            
            {recentEntries.map((entry: JournalEntry) => (
              <div key={entry.id} className="p-3 bg-white/40 dark:bg-amber-800/20 rounded-lg border border-amber-200/30 dark:border-amber-700/30">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs text-amber-600 dark:text-amber-400">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={`text-xs ${i < entry.mood ? 'text-yellow-500' : 'text-gray-300'}`}>
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-300 italic mb-2">"{entry.prompt}"</p>
                <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed mb-2">
                  {entry.response.substring(0, 150)}
                  {entry.response.length > 150 && "..."}
                </p>
                {entry.aiInsight && (
                  <div className="p-2 bg-amber-100 dark:bg-amber-800/50 rounded border-l-2 border-amber-400">
                    <div className="flex items-center space-x-1 mb-1">
                      <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                      <span className="text-xs font-medium text-amber-700 dark:text-amber-300">Gentle Insight</span>
                    </div>
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      {entry.aiInsight}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Journal Benefits */}
        <div className="mt-4 p-3 bg-amber-100 dark:bg-amber-800/50 rounded-lg border border-amber-200 dark:border-amber-700">
          <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">💝 Why Reflect?</h4>
          <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
            Regular reflection helps process experiences, recognize patterns, and celebrate growth. 
            Your responses are completely private and only used to provide gentle, supportive insights 
            tailored to your journey.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}