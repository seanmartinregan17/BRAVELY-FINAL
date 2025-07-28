import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Play, Square, Trash2 } from "lucide-react";
import { sessionStorage, type ActiveSessionData } from "@/lib/session-storage";

interface SessionRecoveryModalProps {
  session: ActiveSessionData;
  onContinue: () => void;
  onDiscard: () => void;
  onClose: () => void;
}

export default function SessionRecoveryModal({ 
  session, 
  onContinue, 
  onDiscard,
  onClose 
}: SessionRecoveryModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      onContinue();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscard = async () => {
    setIsLoading(true);
    try {
      sessionStorage.clearActiveSession();
      onDiscard();
    } finally {
      setIsLoading(false);
    }
  };

  const sessionDuration = Math.floor((Date.now() - session.startTime.getTime()) / 1000 / 60);
  const gpsPoints = session.gpsData?.routePoints?.length || 0;
  const distance = session.gpsData?.totalDistance || 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <CardTitle className="text-xl">Session Recovery</CardTitle>
          <p className="text-sm text-muted-foreground">
            We found an active {session.sessionType.toLowerCase()} session that was interrupted
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Session Info */}
          <div className="bg-muted rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Session Type:</span>
              <span className="font-medium">{session.sessionType}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Duration:</span>
              <span className="font-medium">{sessionDuration} minutes</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">GPS Points:</span>
              <span className="font-medium">{gpsPoints} recorded</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Distance:</span>
              <span className="font-medium">{distance.toFixed(2)} miles</span>
            </div>
          </div>
          
          {session.gpsData?.wasBackgrounded && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                📱 This session was backgrounded or interrupted. Your GPS data has been safely preserved.
              </p>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="space-y-2">
            <Button 
              onClick={handleContinue} 
              disabled={isLoading}
              className="w-full"
            >
              <Play className="w-4 h-4 mr-2" />
              Continue Session
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                onClick={onClose}
                disabled={isLoading}
              >
                <Square className="w-4 h-4 mr-2" />
                Later
              </Button>
              
              <Button 
                variant="destructive" 
                onClick={handleDiscard}
                disabled={isLoading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Discard
              </Button>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            Continuing will restore all your GPS tracking data and resume where you left off.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}