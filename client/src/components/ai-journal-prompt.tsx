import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Lightbulb, Save, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AuthUser } from "@/lib/auth";

interface AIJournalPromptProps {
  user: AuthUser;
  onResponseSaved?: () => void;
}

export default function AIJournalPrompt({ user, onResponseSaved }: AIJournalPromptProps) {
  const [response, setResponse] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Weekly prompts based on exposure therapy and personal growth
  const weeklyPrompts = [
    "What scared you this week, but you did it anyway? How did that feel?",
    "Think about a moment when you felt brave recently. What made you feel that way?",
    "What's one fear you'd like to face next week? What small step could you take?",
    "How has your relationship with anxiety changed since you started this journey?",
    "What would you tell someone else who's struggling with the same fears you have?",
    "What surprising thing did you learn about yourself through exposure therapy?",
    "How do you celebrate your courage? What small victories matter most to you?",
    "What does 'being brave' mean to you now compared to when you started?",
    "What support or tool has been most helpful in your anxiety recovery?",
    "If you could go back and tell your past anxious self one thing, what would it be?"
  ];

  // Get current week's prompt (rotates weekly)
  const getCurrentPrompt = () => {
    const weekOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    return weeklyPrompts[weekOfYear % weeklyPrompts.length];
  };

  const currentPrompt = getCurrentPrompt();

  const saveResponse = async () => {
    if (!response.trim()) {
      toast({
        title: "Empty Response",
        description: "Please write something before saving.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const journalEntry = {
        userId: user.id,
        prompt: currentPrompt,
        response: response.trim(),
        weekOf: new Date().toISOString().split('T')[0]
      };

      // For now, store in localStorage (could be extended to database)
      const existingEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
      existingEntries.push({
        ...journalEntry,
        id: Date.now(),
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('journalEntries', JSON.stringify(existingEntries));

      toast({
        title: "Response Saved!",
        description: "Your reflection has been saved securely.",
      });

      setResponse("");
      onResponseSaved?.();
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save response. Please try again.",
        variant: "destructive"
      });
    }
    
    setIsSaving(false);
  };

  // Get recent entries count
  const getRecentEntriesCount = () => {
    const entries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    return entries.filter((entry: any) => entry.userId === user.id).length;
  };

  const entriesCount = getRecentEntriesCount();

  return (
    <Card className="bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/30 border-violet-200 dark:border-violet-800">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-violet-800 dark:text-violet-200">Weekly Reflection</h3>
            <p className="text-sm text-violet-600 dark:text-violet-300">AI-guided self-discovery</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Current prompt */}
          <div className="bg-white/60 dark:bg-violet-900/30 rounded-lg p-4 border border-violet-200/50 dark:border-violet-700/50">
            <div className="flex items-start gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-violet-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-violet-800 dark:text-violet-200 mb-1">This Week's Prompt</h4>
                <p className="text-sm text-violet-700 dark:text-violet-300 leading-relaxed">
                  {currentPrompt}
                </p>
              </div>
            </div>
          </div>

          {/* Response textarea */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-violet-800 dark:text-violet-200">
              Your Reflection
            </label>
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Take your time... there's no wrong answer. This is your space to reflect and grow."
              className="min-h-[120px] bg-white/70 dark:bg-violet-900/30 border-violet-200 dark:border-violet-700 focus:border-violet-400 dark:focus:border-violet-500 resize-none"
              maxLength={500}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-violet-600 dark:text-violet-400">
                {response.length}/500 characters
              </span>
              <span className="text-xs text-violet-600 dark:text-violet-400">
                {entriesCount} reflections saved
              </span>
            </div>
          </div>

          {/* Save button */}
          <Button 
            onClick={saveResponse}
            disabled={isSaving || !response.trim()}
            className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Reflection"}
          </Button>

          {/* Encouragement */}
          <div className="bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/40 rounded-lg p-3 border border-violet-200/50 dark:border-violet-700/50">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-medium text-violet-800 dark:text-violet-200">
                Your Growth Matters
              </span>
            </div>
            <p className="text-xs text-violet-700 dark:text-violet-300">
              Self-reflection is a powerful tool for healing. Your honest responses help you process experiences and track emotional growth over time.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}