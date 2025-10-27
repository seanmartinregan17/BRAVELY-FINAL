import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation, Clock, Route, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGeolocation } from "@/hooks/use-geolocation";

interface RoutePlannerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface RouteOption {
  id: string;
  name: string;
  description: string;
  distance: string;
  duration: string;
  difficulty: "Easy" | "Medium" | "Hard";
  safetyLevel: "High" | "Medium" | "Low";
}

export default function RoutePlanner({ open, onOpenChange }: RoutePlannerProps) {
  const [destination, setDestination] = useState("");
  const [routeOptions, setRouteOptions] = useState<RouteOption[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<"input" | "options" | "preview">("input");
  const { toast } = useToast();
  const { latitude, longitude, startTracking } = useGeolocation();

  useEffect(() => {
    if (open) {
      startTracking();
    }
  }, [open, startTracking]);

  const generateRouteOptions = (dest: string) => {
    // Generate realistic route options based on destination
    const baseOptions: RouteOption[] = [
      {
        id: "1",
        name: "Direct Route",
        description: "Most direct path to your destination",
        distance: "0.8 miles",
        duration: "12 min walk",
        difficulty: "Easy",
        safetyLevel: "High"
      },
      {
        id: "2", 
        name: "Scenic Route",
        description: "Longer path through parks and quiet streets",
        distance: "1.2 miles",
        duration: "18 min walk",
        difficulty: "Medium",
        safetyLevel: "High"
      },
      {
        id: "3",
        name: "Gradual Exposure",
        description: "Starts quiet, gradually increases activity",
        distance: "1.0 miles", 
        duration: "15 min walk",
        difficulty: "Medium",
        safetyLevel: "Medium"
      }
    ];
    return baseOptions;
  };

  const handlePlanRoute = () => {
    if (!destination.trim()) {
      toast({
        title: "Destination Required",
        description: "Please enter a destination to plan your route.",
        variant: "destructive"
      });
      return;
    }

    if (!latitude || !longitude) {
      toast({
        title: "Location Access Required", 
        description: "Please allow location access to plan routes.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate route planning
    setTimeout(() => {
      const options = generateRouteOptions(destination);
      setRouteOptions(options);
      setCurrentStep("options");
      setIsLoading(false);
    }, 1500);
  };

  const handleSelectRoute = (route: RouteOption) => {
    setSelectedRoute(route);
    setCurrentStep("preview");
  };

  const handleStartRoute = () => {
    toast({
      title: "Route Started",
      description: `Starting your ${selectedRoute?.name} to ${destination}`,
    });
    onOpenChange(false);
    // Here you would typically navigate to the session tracking page
    // with the planned route data
  };

  const resetPlanner = () => {
    setCurrentStep("input");
    setDestination("");
    setRouteOptions([]);
    setSelectedRoute(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "text-green-600 bg-green-100";
      case "Medium": return "text-yellow-600 bg-yellow-100"; 
      case "Hard": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getSafetyColor = (safety: string) => {
    switch (safety) {
      case "High": return "text-green-600";
      case "Medium": return "text-yellow-600";
      case "Low": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {currentStep !== "input" && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  if (currentStep === "preview") setCurrentStep("options");
                  else resetPlanner();
                }}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <DialogTitle className="flex items-center gap-2">
              <Route className="w-5 h-5 text-primary" />
              Plan Your Route
            </DialogTitle>
          </div>
        </DialogHeader>

        {currentStep === "input" && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Plan a safe, comfortable route for your exposure therapy session
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="destination">Where would you like to go?</Label>
                <Input
                  id="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g., Local coffee shop, grocery store..."
                  className="mt-1"
                />
              </div>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Navigation className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 text-sm mb-1">Location Status</h4>
                      <p className="text-sm text-blue-700">
                        {latitude && longitude 
                          ? "✓ Location detected - ready to plan routes"
                          : "📍 Getting your location..."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Button 
              onClick={handlePlanRoute}
              disabled={isLoading || !latitude || !longitude}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              {isLoading ? "Planning Routes..." : "Find Safe Routes"}
            </Button>
          </div>
        )}

        {currentStep === "options" && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-semibold mb-1">Routes to {destination}</h3>
              <p className="text-sm text-muted-foreground">Choose the route that feels right for you today</p>
            </div>

            <div className="space-y-3">
              {routeOptions.map((route) => (
                <Card 
                  key={route.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/20"
                  onClick={() => handleSelectRoute(route)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{route.name}</h4>
                          <p className="text-xs text-muted-foreground">{route.description}</p>
                        </div>
                        <div className="flex gap-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(route.difficulty)}`}>
                            {route.difficulty}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {route.distance}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {route.duration}
                          </span>
                        </div>
                        <span className={`text-xs font-medium ${getSafetyColor(route.safetyLevel)}`}>
                          {route.safetyLevel} Safety
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {currentStep === "preview" && selectedRoute && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="font-semibold mb-1">{selectedRoute.name}</h3>
              <p className="text-sm text-muted-foreground">Ready to start your journey?</p>
            </div>

            <Card className="border-primary/20">
              <CardContent className="p-4 space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Route Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Destination:</span>
                      <span className="font-medium">{destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Distance:</span>
                      <span>{selectedRoute.distance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>{selectedRoute.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Difficulty:</span>
                      <span className={`font-medium ${getDifficultyColor(selectedRoute.difficulty).split(' ')[0]}`}>
                        {selectedRoute.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">{selectedRoute.description}</p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button onClick={handleStartRoute} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                Start This Route
              </Button>
              <Button variant="outline" onClick={() => setCurrentStep("options")} className="w-full">
                Choose Different Route
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}