import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, AlertCircle, CheckCircle } from 'lucide-react';

export default function GPSTestPanel() {
  const [permissionStatus, setPermissionStatus] = useState<string>('unknown');
  const [gpsSupported, setGpsSupported] = useState<boolean>(false);
  const [currentPosition, setCurrentPosition] = useState<{lat: number, lng: number, accuracy: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTestingGPS, setIsTestingGPS] = useState(false);

  useEffect(() => {
    // Check GPS support
    setGpsSupported('geolocation' in navigator);
    
    // Check permission status
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName })
        .then(permission => {
          setPermissionStatus(permission.state);
          console.log('GPS Permission Status:', permission.state);
        })
        .catch(() => {
          setPermissionStatus('unavailable');
        });
    }
  }, []);

  const testGPS = async () => {
    setIsTestingGPS(true);
    setError(null);
    setCurrentPosition(null);

    if (!gpsSupported) {
      setError('GPS not supported in this browser');
      setIsTestingGPS(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setCurrentPosition({ 
          lat: latitude, 
          lng: longitude, 
          accuracy: accuracy 
        });
        setIsTestingGPS(false);
        console.log('GPS Test Success:', { latitude, longitude, accuracy });
      },
      (err) => {
        let errorMessage = 'Unknown GPS error';
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Location permission denied by user';
            setPermissionStatus('denied');
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'GPS position unavailable - try moving outside';
            break;
          case err.TIMEOUT:
            errorMessage = 'GPS request timed out - weak signal';
            break;
        }
        setError(errorMessage);
        setIsTestingGPS(false);
        console.error('GPS Test Error:', err);
      },
      options
    );
  };

  const getStatusIcon = () => {
    if (error) return <AlertCircle className="w-5 h-5 text-red-500" />;
    if (currentPosition) return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <MapPin className="w-5 h-5 text-blue-500" />;
  };

  const getStatusColor = () => {
    if (error) return 'border-red-200 bg-red-50';
    if (currentPosition) return 'border-green-200 bg-green-50';
    return 'border-blue-200 bg-blue-50';
  };

  return (
    <Card className={`mb-4 ${getStatusColor()}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="font-medium">GPS Diagnostic Panel</span>
          </div>
          <Button 
            onClick={testGPS} 
            disabled={isTestingGPS || !gpsSupported}
            size="sm"
          >
            {isTestingGPS ? 'Testing...' : 'Test GPS'}
          </Button>
        </div>

        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">GPS Support:</span>
              <span className={`ml-2 ${gpsSupported ? 'text-green-600' : 'text-red-600'}`}>
                {gpsSupported ? 'Available' : 'Not Supported'}
              </span>
            </div>
            <div>
              <span className="font-medium">Permission:</span>
              <span className={`ml-2 ${
                permissionStatus === 'granted' ? 'text-green-600' : 
                permissionStatus === 'denied' ? 'text-red-600' : 
                'text-yellow-600'
              }`}>
                {permissionStatus === 'granted' ? 'Granted' : 
                 permissionStatus === 'denied' ? 'Denied' : 
                 permissionStatus === 'prompt' ? 'Will Prompt' : 
                 'Unknown'}
              </span>
            </div>
          </div>

          {currentPosition && (
            <div className="mt-3 p-2 bg-green-100 rounded text-green-800 text-xs">
              <div>✅ GPS Test Successful!</div>
              <div>Location: {currentPosition.lat.toFixed(6)}, {currentPosition.lng.toFixed(6)}</div>
              <div>Accuracy: ±{currentPosition.accuracy.toFixed(0)}m</div>
            </div>
          )}

          {error && (
            <div className="mt-3 p-2 bg-red-100 rounded text-red-800 text-xs">
              <div>❌ GPS Test Failed:</div>
              <div>{error}</div>
              {permissionStatus === 'denied' && (
                <div className="mt-1 text-xs">
                  💡 Fix: Check browser settings → Privacy & Security → Site Settings → Location
                </div>
              )}
            </div>
          )}

          {permissionStatus === 'prompt' && !currentPosition && !error && (
            <div className="mt-3 p-2 bg-blue-100 rounded text-blue-800 text-xs">
              ℹ️ Click "Test GPS" to trigger location permission request
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}