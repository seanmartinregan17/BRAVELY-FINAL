import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useActiveSession } from "@/hooks/use-active-session";
import type { AuthUser } from "@/lib/auth";

interface SessionStartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AuthUser;
}

export default function SessionStartModal({ open, onOpenChange, user }: SessionStartModalProps) {
  const [sessionType, setSessionType] = useState("");
  const [fearLevel, setFearLevel] = useState([5]);
  const [moodLevel, setMoodLevel] = useState([5]);
  const [sessionState, setSessionState] = useState<'form' | 'inspiration' | 'starting'>('form');
  const [inspirationText, setInspirationText] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const { setActiveSession, hasActiveSession } = useActiveSession();
  
  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setSessionState('form');
    }
  }, [open]);

  // Pre-session inspirational messages
  const inspirationalMessages = [
    "You got this",
    "Your future self will thank you for the work you put in today",
    "Courage isn't the absence of fear, it's action in spite of it",
    "Every step forward is progress",
    "Take a deep breath and trust yourself",
    "You are braver than you believe",
    "This moment is your opportunity to grow",
    "Breathe deeply, you're exactly where you need to be",
    "Your strength grows each time you face your fears",
    "Progress, not perfection",
    "You've overcome challenges before, you can do this too",
    "Each brave step builds your confidence",
    "Remember to breathe and stay present",
    "You are writing your story of courage today"
  ];

  // Memoized color functions to reduce re-calculations
  const getFearColor = useCallback((value: number) => {
    const ratio = (value - 1) / 9; // Normalize to 0-1
    if (ratio <= 0.5) {
      // Blue to yellow
      const r = Math.round(ratio * 2 * 255);
      const g = Math.round(ratio * 2 * 255);
      const b = 255;
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Yellow to red
      const r = 255;
      const g = Math.round((1 - ratio) * 2 * 255);
      const b = 0;
      return `rgb(${r}, ${g}, ${b})`;
    }
  }, []);

  const getMoodColor = useCallback((value: number) => {
    const ratio = (value - 1) / 9; // Normalize to 0-1
    if (ratio <= 0.5) {
      // Red to yellow
      const r = 255;
      const g = Math.round(ratio * 2 * 255);
      const b = 0;
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Yellow to green
      const r = Math.round((1 - ratio) * 2 * 255);
      const g = 255;
      const b = 0;
      return `rgb(${r}, ${g}, ${b})`;
    }
  }, []);

  // Memoized styles to prevent re-computation
  const fearSliderStyle = useMemo(() => ({
    '--thumb-color': getFearColor(fearLevel[0])
  }), [fearLevel[0], getFearColor]);

  const moodSliderStyle = useMemo(() => ({
    '--thumb-color': getMoodColor(moodLevel[0])
  }), [moodLevel[0], getMoodColor]);



  const startSessionMutation = useMutation({
    mutationFn: async (data: { sessionType: string; fearLevelBefore: number; moodBefore: number }) => {
      const response = await apiRequest("POST", "/api/sessions", { 
        ...data, 
        userId: user.id,
        startTime: new Date().toISOString()
      });
      return response.json();
    },
    onSuccess: (session) => {
      if (session) {
        // Store active session data using the hook
        setActiveSession({
          sessionId: session.id,
          startTime: new Date(session.startTime),
          sessionType: session.sessionType,
          fearLevelBefore: session.fearLevelBefore,
          moodBefore: session.moodBefore,
        });

        queryClient.invalidateQueries({ queryKey: ["/api/sessions", user.id] });
        
        // Navigate immediately and handle cleanup after
        navigate("/session-tracking");
        
        // Clean up states after navigation
        setTimeout(() => {
          onOpenChange(false);
          setSessionState('form');
          setSessionType("");
          setFearLevel([5]);
          setMoodLevel([5]);
          
          toast({
            title: "Session Started",
            description: "Your exposure session is now being tracked.",
          });
        }, 50);
      }
    },
    onError: () => {
      setSessionState('form');
      toast({
        title: "Error",
        description: "Failed to start session. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!sessionType || fearLevel[0] === 0 || moodLevel[0] === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before starting your session.",
        variant: "destructive",
      });
      return;
    }

    // Show inspiration screen and start session
    const randomMessage = inspirationalMessages[Math.floor(Math.random() * inspirationalMessages.length)];
    setInspirationText(randomMessage);
    
    // Close modal immediately and show inspiration
    onOpenChange(false);
    setTimeout(() => {
      setSessionState('inspiration');
      
      // Start session after inspiration display  
      setTimeout(() => {
        setSessionState('starting');
        startSessionMutation.mutate({
          sessionType,
          fearLevelBefore: fearLevel[0],
          moodBefore: moodLevel[0],
        });
      }, 1500);
    }, 100);
  };

  const sessionTypes = [
    "Drive",
    "Shopping/Errands", 
    "Social Gathering",
    "Public Transportation",
    "Work/School",
    "Medical Appointment",
    "Walk",
    "Other",
  ];

  return (
    <>
      {/* Inspiration Screen Overlay */}
      {sessionState === 'inspiration' && (
        <div className={`fixed inset-0 bg-gradient-to-br from-teal-100 via-blue-50 to-teal-50 flex items-center justify-center z-[100] ${
          sessionState !== 'inspiration' ? 'animate-fade-out' : 'animate-fade-in'
        }`}>
          <div className="text-center px-8 py-12 max-w-md mx-auto">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-3xl flex items-center justify-center shadow-lg">
                <img 
                  src="/app-logo.png" 
                  alt="Bravely Logo" 
                  className="w-12 h-12 rounded-2xl"
                />
              </div>
            </div>
            
            <p className="text-2xl font-medium text-gray-800 leading-relaxed mb-8 animate-fade-in-delay">
              {inspirationText}
            </p>
            
            <div className="flex justify-center">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse mx-1" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      )}
      
      <Dialog open={open && sessionState === 'form'} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[350px] mx-auto max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-semibold text-center">Start Exposure Session</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5">
          <div>
            <Label className="text-sm font-medium text-foreground">Session Type</Label>
            <Select value={sessionType} onValueChange={setSessionType}>
              <SelectTrigger className="mt-2 h-11">
                <SelectValue placeholder="Choose your exposure type" />
              </SelectTrigger>
              <SelectContent>
                {sessionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-foreground">Pre-Session Fear Level</Label>
            <p className="text-xs text-muted-foreground mt-1">How anxious or fearful do you feel? (1 = calm, 10 = very anxious)</p>
            <div className="mt-4 px-2">
              <div className="relative">
                {/* Solid gray track */}
                <div className="h-6 w-full rounded-full bg-gray-200 mb-2"></div>
                
                {/* Native range slider with custom styling */}
                <div className="w-full absolute top-0 flex items-center">
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={fearLevel[0]}
                    onChange={(e) => setFearLevel([parseInt(e.target.value)])}
                    className="w-full h-6 bg-transparent appearance-none cursor-pointer fear-slider-native"
                    style={fearSliderStyle as any}
                  />
                </div>
              </div>
              
              {/* Value display with color indicator */}
              <div className="text-center mt-3">
                <div className="flex items-center justify-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-lg"
                    style={{ backgroundColor: getFearColor(fearLevel[0]) }}
                  ></div>
                  <span className="text-lg font-bold text-foreground">{fearLevel[0]}</span>
                  <span className="text-sm text-muted-foreground">/ 10</span>
                </div>
              </div>
              
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>No Fear</span>
                <span>Extreme Fear</span>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground">Pre-Session Mood</Label>
            <p className="text-xs text-muted-foreground mt-1">How is your overall mood right now? (1 = very low, 10 = excellent)</p>
            <div className="mt-4 px-2">
              <div className="relative">
                {/* Solid gray track */}
                <div className="h-6 w-full rounded-full bg-gray-200 mb-2"></div>
                
                {/* Native range slider with custom styling */}
                <div className="w-full absolute top-0 flex items-center">
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={moodLevel[0]}
                    onChange={(e) => setMoodLevel([parseInt(e.target.value)])}
                    className="w-full h-6 bg-transparent appearance-none cursor-pointer mood-slider-native"
                    style={moodSliderStyle as any}
                  />
                </div>
              </div>
              
              {/* Value display with color indicator */}
              <div className="text-center mt-3">
                <div className="flex items-center justify-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-lg"
                    style={{ backgroundColor: getMoodColor(moodLevel[0]) }}
                  ></div>
                  <span className="text-lg font-bold text-foreground">{moodLevel[0]}</span>
                  <span className="text-sm text-muted-foreground">/ 10</span>
                </div>
              </div>
              
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Very Low</span>
                <span>Excellent</span>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleSubmit} 
            className="w-full h-11 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-medium rounded-lg shadow-sm"
            disabled={startSessionMutation.isPending}
          >
            {startSessionMutation.isPending ? "Starting..." : "Begin Session"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
