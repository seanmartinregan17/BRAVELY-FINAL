import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Maximize2, Minimize2 } from 'lucide-react';

interface LiveMapsViewProps {
  latitude: number | null;
  longitude: number | null;
  routePoints: Array<{ latitude: number; longitude: number; timestamp: number }>;
  isTracking: boolean;
  accuracy: number | null;
  gpsError?: string | null;
}

export default function LiveMapsView({ 
  latitude, 
  longitude, 
  routePoints, 
  isTracking,
  accuracy,
  gpsError
}: LiveMapsViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const pathRef = useRef<google.maps.Polyline | null>(null);
  const accuracyCircleRef = useRef<google.maps.Circle | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
          version: 'weekly',
        });

        await loader.load();
        setMapLoaded(true);
      } catch (err) {
        setError('Failed to load Google Maps. Please check your API key.');
        console.error('Google Maps loading error:', err);
      }
    };

    initMap();
  }, []);

  // Create map when loaded and position is available
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !latitude || !longitude) return;

    if (!googleMapRef.current) {
      googleMapRef.current = new google.maps.Map(mapRef.current, {
        center: { lat: latitude, lng: longitude },
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
      });

      // Create current position marker
      markerRef.current = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: googleMapRef.current,
        title: 'Current Position',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#3b82f6',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });

      // Create accuracy circle
      if (accuracy) {
        accuracyCircleRef.current = new google.maps.Circle({
          strokeColor: '#3b82f6',
          strokeOpacity: 0.3,
          strokeWeight: 1,
          fillColor: '#3b82f6',
          fillOpacity: 0.1,
          map: googleMapRef.current,
          center: { lat: latitude, lng: longitude },
          radius: accuracy, // accuracy in meters
        });
      }

      // Create path polyline
      pathRef.current = new google.maps.Polyline({
        path: routePoints.map(point => ({ lat: point.latitude, lng: point.longitude })),
        geodesic: true,
        strokeColor: '#10b981',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        map: googleMapRef.current,
      });
    }
  }, [mapLoaded, latitude, longitude]);

  // Update marker position and accuracy circle
  useEffect(() => {
    if (!googleMapRef.current || !latitude || !longitude) return;

    const newPosition = { lat: latitude, lng: longitude };

    // Update marker position
    if (markerRef.current) {
      markerRef.current.setPosition(newPosition);
    }

    // Update accuracy circle
    if (accuracyCircleRef.current && accuracy) {
      accuracyCircleRef.current.setCenter(newPosition);
      accuracyCircleRef.current.setRadius(accuracy);
    }

    // Center map on current position if tracking
    if (isTracking) {
      googleMapRef.current.panTo(newPosition);
    }
  }, [latitude, longitude, accuracy, isTracking]);

  // Update route path
  useEffect(() => {
    if (!pathRef.current || routePoints.length === 0) return;

    const path = routePoints.map(point => ({ lat: point.latitude, lng: point.longitude }));
    pathRef.current.setPath(path);

    // Fit bounds to show entire route if we have multiple points
    if (routePoints.length > 1 && googleMapRef.current && !isTracking) {
      const bounds = new google.maps.LatLngBounds();
      routePoints.forEach(point => {
        bounds.extend({ lat: point.latitude, lng: point.longitude });
      });
      googleMapRef.current.fitBounds(bounds);
    }
  }, [routePoints, isTracking]);

  if (error) {
    return (
      <Card className="mb-4 border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Maps Unavailable</p>
              <p className="text-xs text-yellow-700">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!mapLoaded) {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-muted-foreground">Loading Maps...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show GPS error state
  if (gpsError && !latitude && !longitude) {
    return (
      <Card className="mb-4 border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex flex-col items-center text-center space-y-2">
            <MapPin className="w-8 h-8 text-red-500" />
            <p className="text-sm font-medium text-red-800">GPS Error</p>
            <p className="text-xs text-red-700">{gpsError}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show waiting state
  if (!latitude || !longitude) {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex flex-col items-center text-center space-y-2">
            <MapPin className="w-8 h-8 text-muted-foreground animate-pulse" />
            <p className="text-sm font-medium">Waiting for GPS location...</p>
            <p className="text-xs text-muted-foreground">Please allow location access when prompted</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          {/* Map Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm border-b p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Live GPS Tracking</span>
                {isTracking && (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 w-8 p-0"
              >
                {isExpanded ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            {/* GPS Status */}
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>{routePoints.length} GPS points recorded</span>
              {accuracy && (
                <span>Accuracy: ±{accuracy.toFixed(0)}m</span>
              )}
            </div>
          </div>

          {/* Map Container */}
          <div
            ref={mapRef}
            className={`w-full transition-all duration-300 ${
              isExpanded ? 'h-80' : 'h-48'
            }`}
            style={{ marginTop: '80px' }}
          />

          {!latitude || !longitude ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80">
              <div className="text-center">
                <MapPin className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Waiting for GPS location...</p>
              </div>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}