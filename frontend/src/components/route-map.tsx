import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Route } from "lucide-react";

interface RoutePoint {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface RouteMapProps {
  routePoints: RoutePoint[];
  className?: string;
}

export default function RouteMap({ routePoints, className = "" }: RouteMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calculate bounds for the route
  const getBounds = (points: RoutePoint[]) => {
    if (points.length === 0) return null;
    
    let minLat = points[0].latitude;
    let maxLat = points[0].latitude;
    let minLng = points[0].longitude;
    let maxLng = points[0].longitude;
    
    points.forEach(point => {
      minLat = Math.min(minLat, point.latitude);
      maxLat = Math.max(maxLat, point.latitude);
      minLng = Math.min(minLng, point.longitude);
      maxLng = Math.max(maxLng, point.longitude);
    });
    
    return { minLat, maxLat, minLng, maxLng };
  };

  // Convert lat/lng to canvas coordinates
  const latLngToCanvas = (lat: number, lng: number, bounds: any, width: number, height: number) => {
    const padding = 20;
    const latRange = bounds.maxLat - bounds.minLat;
    const lngRange = bounds.maxLng - bounds.minLng;
    
    // Handle case where route is very small (stationary)
    const minRange = 0.001; // ~100m
    const effectiveLatRange = Math.max(latRange, minRange);
    const effectiveLngRange = Math.max(lngRange, minRange);
    
    const x = padding + ((lng - bounds.minLng) / effectiveLngRange) * (width - 2 * padding);
    const y = padding + ((bounds.maxLat - lat) / effectiveLatRange) * (height - 2 * padding);
    
    return { x, y };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || routePoints.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const bounds = getBounds(routePoints);
    if (!bounds) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set up styling
    ctx.strokeStyle = '#3b82f6'; // blue-500
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Draw background grid
    ctx.strokeStyle = '#e5e7eb'; // gray-200
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = (width / 10) * i;
      const y = (height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Draw route
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    routePoints.forEach((point, index) => {
      const { x, y } = latLngToCanvas(point.latitude, point.longitude, bounds, width, height);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Draw start point (green)
    if (routePoints.length > 0) {
      const start = latLngToCanvas(routePoints[0].latitude, routePoints[0].longitude, bounds, width, height);
      ctx.fillStyle = '#10b981'; // green-500
      ctx.beginPath();
      ctx.arc(start.x, start.y, 6, 0, 2 * Math.PI);
      ctx.fill();
      
      // Start label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('START', start.x, start.y + 3);
    }
    
    // Draw end point (red)
    if (routePoints.length > 1) {
      const end = latLngToCanvas(
        routePoints[routePoints.length - 1].latitude,
        routePoints[routePoints.length - 1].longitude,
        bounds,
        width,
        height
      );
      ctx.fillStyle = '#ef4444'; // red-500
      ctx.beginPath();
      ctx.arc(end.x, end.y, 6, 0, 2 * Math.PI);
      ctx.fill();
      
      // End label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('END', end.x, end.y + 3);
    }
    
  }, [routePoints]);

  if (routePoints.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Route Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 bg-muted rounded-lg">
            <div className="text-center text-muted-foreground">
              <Route className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No route data available</p>
              <p className="text-xs">Start tracking to see your path</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Route Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative bg-gray-50 rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={320}
            height={200}
            className="w-full h-48 block"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Start</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span>End</span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs">
            {routePoints.length} points tracked
          </div>
        </div>
      </CardContent>
    </Card>
  );
}