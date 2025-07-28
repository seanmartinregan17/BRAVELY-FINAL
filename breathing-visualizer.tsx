import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreathingVisualizerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BreathingVisualizer({ open, onOpenChange }: BreathingVisualizerProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('pause');
  const [cycle, setCycle] = useState(0);
  const [totalCycles] = useState(5);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [smoothScale, setSmoothScale] = useState(0.4);
  const [smoothTimeLeft, setSmoothTimeLeft] = useState(0);
  const [selectedPattern, setSelectedPattern] = useState<'4-7-8' | '4-4-4' | '6-2-6'>('4-7-8');

  // Different breathing patterns
  const breathingPatterns = {
    '4-7-8': { inhale: 4, hold: 7, exhale: 8, pause: 2, name: '4-7-8 Breathing' },
    '4-4-4': { inhale: 4, hold: 4, exhale: 4, pause: 2, name: 'Box Breathing' },
    '6-2-6': { inhale: 6, hold: 2, exhale: 6, pause: 2, name: 'Calm Breathing' }
  };

  const breathingPattern = breathingPatterns[selectedPattern];

  const resetSession = useCallback(() => {
    setIsActive(false);
    setPhase('pause');
    setCycle(0);
    setStartTime(null);
    setSmoothScale(0.4);
    setSmoothTimeLeft(0);
  }, []);

  const changePattern = useCallback((pattern: '4-7-8' | '4-4-4' | '6-2-6') => {
    setSelectedPattern(pattern);
    resetSession();
  }, [resetSession]);

  const startSession = useCallback(() => {
    const now = Date.now();
    setIsActive(true);
    setPhase('inhale');
    setCycle(1);
    setStartTime(now);
  }, []);

  const pauseSession = useCallback(() => {
    setIsActive(false);
  }, []);

  // Get current phase and smooth progress from time
  const getCurrentState = useCallback(() => {
    if (!isActive || !startTime) return { phase: 'pause', scale: 0.4, timeLeft: 0 };
    
    const now = Date.now();
    const totalCycleTime = (breathingPattern.inhale + breathingPattern.hold + breathingPattern.exhale + breathingPattern.pause) * 1000;
    const elapsedSinceStart = now - startTime;
    const elapsedInCurrentCycle = elapsedSinceStart % totalCycleTime;
    
    const inhaleEnd = breathingPattern.inhale * 1000;
    const holdEnd = inhaleEnd + (breathingPattern.hold * 1000);
    const exhaleEnd = holdEnd + (breathingPattern.exhale * 1000);
    
    const minScale = 0.4;  // Much smaller minimum for dramatic exhale
    const maxScale = 1.3;  // Much larger maximum for dramatic inhale
    
    if (elapsedInCurrentCycle < inhaleEnd) {
      // Inhale phase - smooth expansion
      const progress = elapsedInCurrentCycle / inhaleEnd;
      const smoothProgress = 1 - Math.cos(progress * Math.PI / 2); // Ease out
      const scale = minScale + (maxScale - minScale) * smoothProgress;
      const timeLeft = ((inhaleEnd - elapsedInCurrentCycle) / 1000);
      
      return { phase: 'inhale' as const, scale, timeLeft };
    } else if (elapsedInCurrentCycle < holdEnd) {
      // Hold phase - stay at max scale
      const timeLeft = ((holdEnd - elapsedInCurrentCycle) / 1000);
      return { phase: 'hold' as const, scale: maxScale, timeLeft };
    } else if (elapsedInCurrentCycle < exhaleEnd) {
      // Exhale phase - smooth contraction
      const progress = (elapsedInCurrentCycle - holdEnd) / (breathingPattern.exhale * 1000);
      const smoothProgress = Math.sin(progress * Math.PI / 2); // Ease in
      const scale = maxScale - (maxScale - minScale) * smoothProgress;
      const timeLeft = ((exhaleEnd - elapsedInCurrentCycle) / 1000);
      
      return { phase: 'exhale' as const, scale, timeLeft };
    } else {
      // Pause phase - stay at min scale
      const timeLeft = ((totalCycleTime - elapsedInCurrentCycle) / 1000);
      return { phase: 'pause' as const, scale: minScale, timeLeft };
    }
  }, [isActive, startTime]);

  // Smooth animation loop
  useEffect(() => {
    if (!open) return;

    let animationFrame: number;
    
    const animate = () => {
      const state = getCurrentState();
      setPhase(state.phase);
      setSmoothScale(state.scale);
      setSmoothTimeLeft(state.timeLeft);
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [getCurrentState, open]);

  // Cycle management
  useEffect(() => {
    if (!isActive || !open || !startTime) return;

    const checkCycleCompletion = () => {
      const now = Date.now();
      const totalCycleTime = (breathingPattern.inhale + breathingPattern.hold + breathingPattern.exhale + breathingPattern.pause) * 1000;
      const elapsedSinceStart = now - startTime;
      const completedCycles = Math.floor(elapsedSinceStart / totalCycleTime);
      
      if (completedCycles >= totalCycles) {
        setIsActive(false);
        setPhase('pause');
        setCycle(totalCycles);
        return;
      }
      
      const currentCycle = completedCycles + 1;
      if (currentCycle !== cycle) {
        setCycle(currentCycle);
      }
    };

    const interval = setInterval(checkCycleCompletion, 100);
    return () => clearInterval(interval);
  }, [isActive, open, startTime, cycle, totalCycles]);

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'pause': return isActive ? 'Rest' : 'Ready';
    }
  };

  // Get phase-specific colors
  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return { 
        primary: '#3b82f6', 
        secondary: '#06b6d4',
        textColor: 'text-blue-600',
        bgGlow: 'from-blue-50 to-cyan-50'
      };
      case 'hold': return { 
        primary: '#8b5cf6', 
        secondary: '#a855f7',
        textColor: 'text-purple-600',
        bgGlow: 'from-purple-50 to-indigo-50'
      };
      case 'exhale': return { 
        primary: '#16a34a', 
        secondary: '#22c55e',
        textColor: 'text-green-600',
        bgGlow: 'from-green-50 to-emerald-50'
      };
      case 'pause': return { 
        primary: '#9ca3af', 
        secondary: '#6b7280',
        textColor: 'text-gray-600',
        bgGlow: 'from-gray-50 to-slate-50'
      };
    }
  };

  if (!open) return null;

  const colors = getPhaseColor();
  const displayTime = Math.ceil(smoothTimeLeft);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
        <CardContent className="p-8 text-center">
          
          {/* Title and Pattern Selection */}
          <div className="mb-6">
            <h3 className="text-2xl font-normal mb-4 text-gray-900 dark:text-gray-100">
              {breathingPattern.name}
            </h3>
            
            {/* Pattern selector */}
            <div className="flex items-center justify-center space-x-2 mb-4">
              {Object.entries(breathingPatterns).map(([key, pattern]) => (
                <button
                  key={key}
                  onClick={() => changePattern(key as '4-7-8' | '4-4-4' | '6-2-6')}
                  className={cn("px-3 py-1 rounded-full text-xs font-medium transition-all duration-200", {
                    "bg-teal-500 text-white": selectedPattern === key,
                    "bg-gray-200 text-gray-700 hover:bg-gray-300": selectedPattern !== key
                  })}
                  disabled={isActive}
                >
                  {key}
                </button>
              ))}
            </div>
            
            {/* Cycle indicators */}
            <div className="flex items-center justify-center space-x-1">
              {Array.from({ length: totalCycles }, (_, i) => (
                <div
                  key={i}
                  className={cn("w-1.5 h-1.5 rounded-full transition-all duration-300", {
                    "bg-teal-500": i < cycle,
                    "bg-gray-300 dark:bg-gray-600": i >= cycle
                  })}
                />
              ))}
            </div>
          </div>

          {/* Main visualization area */}
          <div className={cn("relative mx-auto mb-6 w-60 h-60 rounded-full transition-all duration-1000 bg-gradient-to-br", colors.bgGlow)}>
            
            {/* Pure hexagon visual */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="relative transition-transform duration-200 ease-out"
                style={{
                  transform: `scale(${smoothScale})`,
                }}
              >
                <svg 
                  width="120" 
                  height="104" 
                  viewBox="0 0 120 104"
                  className="drop-shadow-xl"
                >
                  <defs>
                    <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={colors.primary} stopOpacity="0.8" />
                      <stop offset="100%" stopColor={colors.secondary} stopOpacity="0.9" />
                    </linearGradient>
                    
                    <linearGradient id="hexGlass" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="white" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="white" stopOpacity="0.1" />
                    </linearGradient>
                    
                    <filter id="glassBlur" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Main hexagon with glass effect - perfectly equilateral */}
                  <polygon
                    points="60,12 90,30 90,66 60,84 30,66 30,30"
                    fill="url(#hexGradient)"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="1"
                    filter="url(#glassBlur)"
                  />
                  
                  {/* Glass highlight overlay */}
                  <polygon
                    points="60,12 90,30 90,66 60,84 30,66 30,30"
                    fill="url(#hexGlass)"
                    stroke="rgba(255,255,255,0.8)"
                    strokeWidth="0.5"
                  />
                  
                  {/* Inner hexagon for depth */}
                  <polygon
                    points="60,24 78,36 78,60 60,72 42,60 42,36"
                    fill="none"
                    stroke="rgba(255,255,255,0.4)"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Text information below the hexagon */}
          <div className="text-center mb-8 space-y-3">
            <div className={cn("text-6xl font-extralight transition-all duration-300", colors.textColor)}>
              {displayTime}
            </div>
            <div className={cn("text-xl font-light transition-all duration-300", colors.textColor)}>
              {getPhaseText()}
            </div>
          </div>

          {/* Instruction text */}
          <div className="mb-8">
            <p className={cn("text-sm font-light transition-colors duration-300 opacity-70", colors.textColor)}>
              {phase === 'inhale' && "Inhale slowly through your nose"}
              {phase === 'hold' && "Hold your breath gently"}
              {phase === 'exhale' && "Exhale slowly through your mouth"}
              {phase === 'pause' && !isActive && "Press start to begin"}
              {phase === 'pause' && isActive && "Prepare for next breath"}
            </p>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3 mb-4">
            {!isActive ? (
              <Button 
                onClick={startSession}
                className="bg-teal-500 hover:bg-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-2 text-sm font-medium rounded-full border-0"
              >
                <Play className="w-4 h-4 mr-2" />
                Start
              </Button>
            ) : (
              <Button 
                onClick={pauseSession}
                variant="outline"
                className="bg-white/80 hover:bg-white/90 text-gray-700 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-2 text-sm font-medium rounded-full"
              >
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
            
            <Button 
              onClick={resetSession}
              variant="outline"
              className="bg-white/80 hover:bg-white/90 text-gray-700 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-2 text-sm font-medium rounded-full"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Close */}
          <Button
            onClick={() => onOpenChange(false)}
            variant="ghost"
            className="text-gray-500 hover:text-gray-700 font-light text-sm"
          >
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}