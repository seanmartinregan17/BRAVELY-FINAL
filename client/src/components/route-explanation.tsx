import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Route, Target, Clock } from "lucide-react";

interface RouteExplanationProps {
  onDismiss: () => void;
}

export default function RouteExplanation({ onDismiss }: RouteExplanationProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Route className="w-5 h-5 text-primary" />
            <span>How Route Tracking Works</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Automatic GPS Tracking</p>
                <p className="text-xs text-muted-foreground">
                  Bravely gets an initial GPS lock (within 50m accuracy), then records your precise location as you move during exposure sessions.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Target className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Smart Movement Detection</p>
                <p className="text-xs text-muted-foreground">
                  Ultra-strict filtering requires 25-60+ feet of movement with excellent GPS accuracy to prevent indoor drift and record only meaningful progress.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Real-time Progress</p>
                <p className="text-xs text-muted-foreground">
                  Watch your distance goals get updated live as you walk or explore new areas.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-muted rounded-lg p-3">
            <p className="text-sm font-medium mb-2">What gets tracked:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Total distance traveled</li>
              <li>• GPS coordinates along your route</li>
              <li>• Time stamps for each location</li>
              <li>• Progress toward your distance goals</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>Privacy Note:</strong> Your location data stays on your device and our secure servers. It's only used to calculate distances and track your exposure therapy progress.
            </p>
          </div>
          
          <Button onClick={onDismiss} className="w-full">
            Got it! Start My Session
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}