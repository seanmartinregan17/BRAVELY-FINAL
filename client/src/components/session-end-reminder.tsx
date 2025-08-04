import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Zap } from 'lucide-react';

interface SessionEndReminderProps {
  isOpen: boolean;
  onEndSession: () => void;
  onContinue: () => void;
  onDismiss: () => void;
  sessionDuration: string;
  distanceTraveled: number;
}

export default function SessionEndReminder({ 
  isOpen, 
  onEndSession, 
  onContinue, 
  onDismiss,
  sessionDuration,
  distanceTraveled 
}: SessionEndReminderProps) {
  const [isEnding, setIsEnding] = useState(false);

  const handleEndSession = async () => {
    setIsEnding(true);
    await onEndSession();
    setIsEnding(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={() => {}}>
      <AlertDialogContent className="max-w-md mx-auto">
        <AlertDialogHeader>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <AlertDialogTitle className="text-lg">Session Still Active</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left space-y-3">
            <p>
              It looks like you might have finished your exposure session. You haven't moved much in the last 5 minutes.
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Duration</span>
                </div>
                <span className="text-sm text-blue-700 dark:text-blue-400 font-semibold">
                  {sessionDuration}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Distance</span>
                </div>
                <span className="text-sm text-green-700 dark:text-green-400 font-semibold">
                  {distanceTraveled.toFixed(2)} miles
                </span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Would you like to end your session now to save your progress, or continue tracking?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button
              variant="ghost"
              onClick={onDismiss}
              className="flex-1 text-muted-foreground hover:text-foreground"
            >
              Remind me later
            </Button>
            
            <Button
              variant="outline"
              onClick={onContinue}
              className="flex-1"
            >
              <Zap className="w-4 h-4 mr-2" />
              Continue Session
            </Button>
            
            <Button
              onClick={handleEndSession}
              disabled={isEnding}
              className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              {isEnding ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Clock className="w-4 h-4 mr-2" />
              )}
              End Session
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}