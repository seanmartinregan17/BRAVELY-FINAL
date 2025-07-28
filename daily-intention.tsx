import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Target, Edit, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";
import type { AuthUser } from "@/lib/auth";

interface DailyIntentionProps {
  user: AuthUser;
}

const intentionSuggestions = [
  "Leave the driveway",
  "Walk to the mailbox", 
  "Drive 0.5 miles",
  "Visit one store",
  "Take the elevator",
  "Attend one meeting",
  "Say hello to a neighbor",
  "Order coffee in person"
];

export default function DailyIntention({ user }: DailyIntentionProps) {
  const [isEditing, setIsEditing] = useState(false); // Always start collapsed
  const [intention, setIntention] = useState(user.dailyIntention || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSave = async () => {
    if (!intention.trim()) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/user/${user.id}/daily-intention`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dailyIntention: intention.trim() })
      });

      if (!response.ok) {
        throw new Error('Failed to save intention');
      }

      await queryClient.invalidateQueries({ queryKey: ["/api/user", user.id] });
      setIsEditing(false);
      toast({
        title: "Daily intention set!",
        description: "Small steps lead to big progress"
      });
    } catch (error) {
      console.error('Failed to save intention:', error);
      toast({
        title: "Failed to save intention",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIntention(user.dailyIntention || "");
    setIsEditing(false);
  };

  const selectSuggestion = (suggestion: string) => {
    setIntention(suggestion);
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-blue-900 dark:text-blue-100">Today I'll Try...</h3>
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="ml-auto p-1 h-6 w-6"
            >
              <Edit className="h-3 w-3" />
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <Input
              placeholder="Set a small, achievable goal for today..."
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              maxLength={100}
              className="bg-white/80 dark:bg-gray-800/80"
            />
            
            <div className="flex flex-wrap gap-1">
              {intentionSuggestions.map((suggestion) => (
                <Badge
                  key={suggestion}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/50 text-xs"
                  onClick={() => selectSuggestion(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!intention.trim() || isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Check className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-blue-800 dark:text-blue-200 font-medium">
              {intention || "Set a small goal for today"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}