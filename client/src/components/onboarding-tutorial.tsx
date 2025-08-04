import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle, Play, MapPin, TrendingUp, Brain, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface OnboardingTutorialProps {
  open: boolean;
  onComplete: () => void;
  user: any;
}

const tutorialSteps = [
  {
    id: 'welcome',
    title: 'Welcome to Bravely! 🌟',
    description: 'Your journey to confidence starts here',
    content: (
      <div className="space-y-4">
        <div className="text-center">
          <img src="/app-logo.png" alt="Bravely" className="w-20 h-20 mx-auto mb-4 rounded-lg shadow-lg" />
          <p className="text-lg text-muted-foreground mb-4">
            Bravely helps you track exposure therapy sessions and build confidence through gradual, supported challenges.
          </p>
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 p-4 rounded-lg">
            <p className="text-sm font-medium text-teal-800 dark:text-teal-200">
              "Courage isn't the absence of fear, but taking action despite it."
            </p>
          </div>
        </div>
      </div>
    ),
    icon: <Award className="w-6 h-6" />,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'sessions',
    title: 'Track Your Sessions',
    description: 'Record exposure therapy sessions with GPS tracking',
    content: (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-lg">
          <Play className="w-8 h-8 text-teal-600" />
          <div>
            <h4 className="font-medium">Start Session</h4>
            <p className="text-sm text-muted-foreground">Tap the floating button to begin tracking</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
          <MapPin className="w-8 h-8 text-blue-600" />
          <div>
            <h4 className="font-medium">GPS Tracking</h4>
            <p className="text-sm text-muted-foreground">We'll track your route and distance automatically</p>
          </div>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>Tip:</strong> Rate your fear and mood levels before and after each session to track progress.
          </p>
        </div>
      </div>
    ),
    icon: <Play className="w-6 h-6" />,
    color: 'from-teal-500 to-cyan-500'
  },
  {
    id: 'progress',
    title: 'Monitor Your Progress',
    description: 'View detailed analytics and achievements',
    content: (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg">
          <TrendingUp className="w-8 h-8 text-emerald-600" />
          <div>
            <h4 className="font-medium">Progress Charts</h4>
            <p className="text-sm text-muted-foreground">See weekly stats and fear level trends</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-lg">
          <Award className="w-8 h-8 text-violet-600" />
          <div>
            <h4 className="font-medium">Achievements</h4>
            <p className="text-sm text-muted-foreground">Unlock rewards as you reach milestones</p>
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-200">
            <strong>Remember:</strong> Progress isn't always linear. Celebrate small wins!
          </p>
        </div>
      </div>
    ),
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 'cbt-tools',
    title: 'CBT Tools & Resources',
    description: 'Access therapeutic tools when you need them',
    content: (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
          <Brain className="w-8 h-8 text-blue-600" />
          <div>
            <h4 className="font-medium">Breathing Exercises</h4>
            <p className="text-sm text-muted-foreground">Guided breathing to calm anxiety</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg text-center">
            <p className="text-sm font-medium text-pink-800 dark:text-pink-200">Thought Challenging</p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-center">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Grounding Techniques</p>
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Available 24/7:</strong> Access these tools anytime you need support during or after sessions.
          </p>
        </div>
      </div>
    ),
    icon: <Brain className="w-6 h-6" />,
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: 'getting-started',
    title: 'Ready to Begin?',
    description: 'Your first steps to building confidence',
    content: (
      <div className="space-y-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-semibold text-lg mb-2">You're All Set!</h4>
          <p className="text-muted-foreground mb-4">
            Start with small, manageable challenges. Each step forward is progress.
          </p>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-lg">
            <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
            <p className="text-sm">Start your first exposure session</p>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
            <p className="text-sm">Use CBT tools if you feel overwhelmed</p>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg">
            <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
            <p className="text-sm">Track your progress and celebrate wins</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg">
          <p className="text-sm text-purple-800 dark:text-purple-200 font-medium text-center">
            "The expert in anything was once a beginner."
          </p>
        </div>
      </div>
    ),
    icon: <CheckCircle className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-500'
  }
];

export default function OnboardingTutorial({ open, onComplete, user }: OnboardingTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateOnboardingMutation = useMutation({
    mutationFn: async (data: { step: number; completed: boolean }) => {
      const response = await apiRequest("PUT", `/api/user/${user.id}/onboarding`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
  });

  const handleNext = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    if (currentStep < tutorialSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      // Don't update onboarding progress for intermediate steps
    } else {
      // Complete onboarding
      try {
        await updateOnboardingMutation.mutateAsync({ 
          step: tutorialSteps.length, 
          completed: true 
        });
        
        toast({
          title: "Welcome to Bravely! 🎉",
          description: "You're ready to start your journey to confidence.",
        });
        onComplete();
      } catch (error) {
        console.error('Failed to complete onboarding:', error);
        onComplete(); // Still close the modal even if API fails
      }
    }
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handlePrevious = () => {
    if (isAnimating || currentStep === 0) return;
    setIsAnimating(true);
    setCurrentStep(currentStep - 1);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleSkip = async () => {
    try {
      await updateOnboardingMutation.mutateAsync({ 
        step: tutorialSteps.length, 
        completed: true 
      });
    } catch (error) {
      console.error('Failed to update onboarding:', error);
    } finally {
      onComplete(); // Always close the modal
    }
  };

  const currentStepData = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${currentStepData.color} flex items-center justify-center text-white`}>
                {currentStepData.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold">{currentStepData.title}</h2>
                <p className="text-sm text-muted-foreground">{currentStepData.description}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComplete()}
              className="text-muted-foreground hover:text-foreground"
              title="Close tutorial"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Step {currentStep + 1} of {tutorialSteps.length}</span>
              <span className="text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className={`transition-all duration-300 ${isAnimating ? 'opacity-50 transform translate-x-2' : 'opacity-100 transform translate-x-0'}`}>
            {currentStepData.content}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-muted/30">
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 0 || isAnimating}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleSkip}
                className="text-muted-foreground"
              >
                Skip Tour
              </Button>
              <Button
                onClick={handleNext}
                disabled={isAnimating}
                className={`flex items-center gap-2 bg-gradient-to-r ${currentStepData.color} text-white hover:opacity-90`}
              >
                {currentStep === tutorialSteps.length - 1 ? "Get Started" : "Next"}
                {currentStep === tutorialSteps.length - 1 ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}