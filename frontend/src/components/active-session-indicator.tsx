import { useActiveSession } from "@/hooks/use-active-session";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Play, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function ActiveSessionIndicator() {
  const { activeSession, hasActiveSession } = useActiveSession();
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!activeSession) return;

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - activeSession.startTime.getTime()) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeSession]);

  if (!hasActiveSession || !activeSession) {
    return null;
  }

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleResumeSession = () => {
    console.log('Resume button clicked, navigating to /session-tracking');
    console.log('Current active session:', activeSession);
    console.log('Session storage check:', localStorage.getItem('bravely_active_session'));
    // Use direct window navigation to ensure it works
    window.location.href = "/session-tracking";
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in-0 slide-in-from-top-2">
      <Card className="border-green-200 bg-green-50 shadow-lg">
        <CardContent className="p-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <div className="text-sm">
                <p className="font-medium text-green-800">Active Session</p>
                <p className="text-green-700 text-xs">{activeSession.sessionType}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 text-green-700">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-mono">{formatTime(elapsedTime)}</span>
            </div>

            <Button
              onClick={handleResumeSession}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white h-8 px-3"
            >
              <Play className="w-3 h-3 mr-1" />
              Resume
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}