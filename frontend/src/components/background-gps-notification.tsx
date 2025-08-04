import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone, MapPin, Battery, Settings } from 'lucide-react';
import { Capacitor } from '@capacitor/core';

interface BackgroundGPSNotificationProps {
  isVisible: boolean;
  onDismiss: () => void;
  sessionDuration: string;
  pointsRecorded: number;
}

export default function BackgroundGPSNotification({ 
  isVisible, 
  onDismiss, 
  sessionDuration, 
  pointsRecorded 
}: BackgroundGPSNotificationProps) {
  const [isNative, setIsNative] = useState(false);

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200 dark:border-blue-700">
        <CardContent className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">
                {isNative ? 'Background GPS Active' : 'Keep App Open for GPS'}
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Session: {sessionDuration}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">GPS Points</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{pointsRecorded}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                {isNative ? 'Tracking in background' : 'Active tracking'}
              </span>
            </div>
          </div>

          {/* Native vs Web Instructions */}
          {isNative ? (
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Smartphone className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Native App Benefits
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    • GPS continues when phone is locked<br/>
                    • Background tracking during other apps<br/>
                    • Battery optimized location updates
                  </p>
                </div>
              </div>
              
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Your session will continue tracking even if you close the app or lock your phone.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <Battery className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    Web App Limitations
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                    • Keep app open for continuous GPS<br/>
                    • Avoid switching to other apps<br/>
                    • Prevent phone from locking
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                <Settings className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  For full background GPS, deploy as native app
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <Button 
              onClick={onDismiss}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Continue Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}