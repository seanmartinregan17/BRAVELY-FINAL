import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Navigation, Clock } from 'lucide-react';

interface RoutePoint {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface EnhancedRouteMapProps {
  routePoints: RoutePoint[];
  className?: string;
}

interface AddressInfo {
  start: string;
  end: string;
  distance: number;
  duration: string;
}

export default function EnhancedRouteMap({ routePoints, className = "" }: EnhancedRouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [addressInfo, setAddressInfo] = useState<AddressInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      try {
        const loader = new Loader({
          apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
          version: 'weekly',
          libraries: ['geometry', 'places', 'geocoding']
        });

        await loader.load();
        setMapLoaded(true);
      } catch (err) {
        setError('Unable to load map. Using simplified view.');
        console.error('Google Maps loading error:', err);
      }
    };

    initMap();
  }, []);

  // Reverse geocode addresses and create map
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || routePoints.length === 0) return;

    const createMap = async () => {
      try {
        // Create map
        const map = new google.maps.Map(mapRef.current!, {
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          styles: [
            {
              featureType: 'poi.business',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ],
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: true,
          scaleControl: true,
          streetViewControl: true,
          rotateControl: false,
          fullscreenControl: true,
        });

        googleMapRef.current = map;

        // Create route path
        const routePath = routePoints.map(point => ({
          lat: point.latitude,
          lng: point.longitude
        }));

        const routePolyline = new google.maps.Polyline({
          path: routePath,
          geodesic: true,
          strokeColor: '#10b981',
          strokeOpacity: 1.0,
          strokeWeight: 4,
          map: map,
        });

        // Add start and end markers
        const startPoint = routePoints[0];
        const endPoint = routePoints[routePoints.length - 1];

        const startMarker = new google.maps.Marker({
          position: { lat: startPoint.latitude, lng: startPoint.longitude },
          map: map,
          title: 'Start Location',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#22c55e',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
          },
        });

        const endMarker = new google.maps.Marker({
          position: { lat: endPoint.latitude, lng: endPoint.longitude },
          map: map,
          title: 'End Location',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#ef4444',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
          },
        });

        // Fit bounds to show entire route
        const bounds = new google.maps.LatLngBounds();
        routePoints.forEach(point => {
          bounds.extend({ lat: point.latitude, lng: point.longitude });
        });
        map.fitBounds(bounds);

        // Add some padding to bounds
        map.setZoom(Math.max(12, map.getZoom()! - 1));

        // Try reverse geocoding for addresses (fallback to coordinates if geocoding fails)
        let startResult = `${startPoint.latitude.toFixed(4)}, ${startPoint.longitude.toFixed(4)}`;
        let endResult = `${endPoint.latitude.toFixed(4)}, ${endPoint.longitude.toFixed(4)}`;
        
        try {
          const geocoder = new google.maps.Geocoder();
          
          const [startGeocode, endGeocode] = await Promise.all([
            new Promise<string>((resolve) => {
              geocoder.geocode(
                { location: { lat: startPoint.latitude, lng: startPoint.longitude } },
                (results, status) => {
                  if (status === 'OK' && results && results[0]) {
                    // Get a clean address without country/postal code
                    const addressComponents = results[0].formatted_address.split(',');
                    const cleanAddress = addressComponents.slice(0, 2).join(',').trim();
                    resolve(cleanAddress || results[0].formatted_address);
                  } else {
                    resolve(startResult); // Use coordinates as fallback
                  }
                }
              );
            }),
            new Promise<string>((resolve) => {
              geocoder.geocode(
                { location: { lat: endPoint.latitude, lng: endPoint.longitude } },
                (results, status) => {
                  if (status === 'OK' && results && results[0]) {
                    // Get a clean address without country/postal code
                    const addressComponents = results[0].formatted_address.split(',');
                    const cleanAddress = addressComponents.slice(0, 2).join(',').trim();
                    resolve(cleanAddress || results[0].formatted_address);
                  } else {
                    resolve(endResult); // Use coordinates as fallback
                  }
                }
              );
            })
          ]);
          
          startResult = startGeocode;
          endResult = endGeocode;
        } catch (error) {
          console.log('Geocoding not available, showing coordinates instead');
          // Keep coordinate fallbacks
        }

        // Calculate route distance
        let totalDistance = 0;
        for (let i = 1; i < routePoints.length; i++) {
          const prev = routePoints[i - 1];
          const curr = routePoints[i];
          totalDistance += calculateDistance(prev.latitude, prev.longitude, curr.latitude, curr.longitude);
        }

        // Calculate duration
        const startTime = routePoints[0].timestamp;
        const endTime = routePoints[routePoints.length - 1].timestamp;
        const durationMs = endTime - startTime;
        const durationMin = Math.floor(durationMs / 60000);

        setAddressInfo({
          start: startResult,
          end: endResult,
          distance: totalDistance,
          duration: durationMin > 60 
            ? `${Math.floor(durationMin / 60)}h ${durationMin % 60}m`
            : `${durationMin}m`
        });

        // Add info windows for start and end
        const startInfoWindow = new google.maps.InfoWindow({
          content: `<div style="padding: 10px; max-width: 250px; font-family: system-ui;">
            <div style="font-weight: bold; color: #22c55e; margin-bottom: 6px; display: flex; align-items: center;">
              <span style="width: 8px; height: 8px; background: #22c55e; border-radius: 50%; margin-right: 6px;"></span>
              Start Location
            </div>
            <div style="font-size: 13px; margin-bottom: 4px; color: #333;">${startResult}</div>
            <div style="font-size: 11px; color: #666;">
              ${new Date(startPoint.timestamp).toLocaleTimeString()}
            </div>
          </div>`
        });

        const endInfoWindow = new google.maps.InfoWindow({
          content: `<div style="padding: 10px; max-width: 250px; font-family: system-ui;">
            <div style="font-weight: bold; color: #ef4444; margin-bottom: 6px; display: flex; align-items: center;">
              <span style="width: 8px; height: 8px; background: #ef4444; border-radius: 50%; margin-right: 6px;"></span>
              End Location
            </div>
            <div style="font-size: 13px; margin-bottom: 4px; color: #333;">${endResult}</div>
            <div style="font-size: 11px; color: #666;">
              ${new Date(endPoint.timestamp).toLocaleTimeString()}
            </div>
          </div>`
        });

        startMarker.addListener('click', () => {
          endInfoWindow.close();
          startInfoWindow.open(map, startMarker);
        });

        endMarker.addListener('click', () => {
          startInfoWindow.close();
          endInfoWindow.open(map, endMarker);
        });

      } catch (err) {
        console.error('Error creating enhanced route map:', err);
        setError('Unable to load detailed map view.');
      }
    };

    createMap();
  }, [mapLoaded, routePoints]);

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (value: number): number => {
    return value * Math.PI / 180;
  };

  // Fallback to simple route visualization
  if (error) {
    return (
      <Card className={`${className} border-amber-200 bg-amber-50`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <MapPin className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-800">Route Map</p>
              <p className="text-xs text-amber-700">{error}</p>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg p-4 text-center">
            <Navigation className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">{routePoints.length} GPS points tracked</p>
            <p className="text-xs text-gray-500 mt-1">
              Distance: {calculateDistance(
                routePoints[0]?.latitude || 0,
                routePoints[0]?.longitude || 0,
                routePoints[routePoints.length - 1]?.latitude || 0,
                routePoints[routePoints.length - 1]?.longitude || 0
              ).toFixed(2)} miles
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!mapLoaded) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-muted-foreground">Loading enhanced route map...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-0">
        {/* Address Info Header */}
        {addressInfo && (
          <div className="p-4 border-b bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">Start</p>
                  <p className="text-xs text-green-600 dark:text-green-300 truncate">{addressInfo.start}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-red-700 dark:text-red-400">End</p>
                  <p className="text-xs text-red-600 dark:text-red-300 truncate">{addressInfo.end}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-200/50">
                <div className="flex items-center space-x-2">
                  <Navigation className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                    {addressInfo.distance.toFixed(2)} miles
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-400">
                    {addressInfo.duration}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Google Map */}
        <div
          ref={mapRef}
          className="w-full h-80"
        />
      </CardContent>
    </Card>
  );
}