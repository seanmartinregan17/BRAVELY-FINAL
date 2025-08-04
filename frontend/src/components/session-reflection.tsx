import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MessageSquare, Send, SkipForward } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface SessionReflectionProps {
  sessionId: number;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function SessionReflection({ 
  sessionId, 
  isOpen, 
  onClose, 
  onComplete 
}: SessionReflectionProps) {
  const [reflection, setReflection] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const reflectionPrompts = [
    "How did that feel compared to what you expected?",
    "What did you learn about yourself today?", 
    "What would you tell someone else who was nervous about this?",
    "What surprised you most about this experience?",
    "How do you feel about trying this again?"
  ];

  const randomPrompt = reflectionPrompts[Math.floor(Math.random() * reflectionPrompts.length)];

  const handleSubmit = async () => {
    if (!reflection.trim()) {
      handleSkip();
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest(`/api/sessions/${sessionId}/reflection`, {
        method: 'PATCH',
        body: JSON.stringify({ reflection: reflection.trim() })
      });
      
      toast({
        title: "Reflection saved",
        description: "Your insights help track your progress",
        variant: "default"
      });
      
      onComplete();
    } catch (error) {
      toast({
        title: "Error saving reflection",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-center">
            <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
            Quick Reflection
          </DialogTitle>
        </DialogHeader>
        
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
          <CardContent className="p-4">
            <div className="mb-4">
              <p className="text-sm text-blue-800 font-medium mb-2">Reflection prompt:</p>
              <p className="text-sm text-blue-700 italic">"{randomPrompt}"</p>
            </div>
            
            <Textarea
              placeholder="Share your thoughts... (optional)"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className="min-h-20 mb-4 border-blue-200 focus:border-blue-400"
              maxLength={200}
            />
            
            <div className="text-xs text-blue-600 mb-4">
              {reflection.length}/200 characters
            </div>
            
            <div className="flex space-x-2">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleSkip}
                className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <SkipForward className="w-4 h-4 mr-2" />
                Skip
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <p className="text-xs text-gray-500 text-center">
          Reflecting on your experiences helps build awareness and confidence
        </p>
      </DialogContent>
    </Dialog>
  );
}