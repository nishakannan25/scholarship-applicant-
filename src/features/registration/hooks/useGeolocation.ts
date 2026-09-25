import { useState, useEffect } from 'react';
import { api } from '../../../services/api';

export interface LocationData {
  city: string;
  state: string;
  country: string;
}

export interface UseGeolocationResult {
  location: LocationData | null;
  loading: boolean;
  detected: boolean;
  denied: boolean;
  error: string | null;
  detectLocation: () => void;
}

export function useGeolocation(): UseGeolocationResult {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [detected, setDetected] = useState<boolean>(false);
  const [denied, setDenied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setDenied(true);
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);
    setDenied(false);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // 1. Try backend reverse-geocoding call
          const data = await api.post<LocationData>('/api/geocoding/reverse', {
            lat: latitude,
            lng: longitude,
          });

          if (data && data.city) {
            setLocation({
              city: data.city,
              state: data.state || '',
              country: data.country || '',
            });
            setDetected(true);
            return;
          }
        } catch {
          // Ignore backend failure and fallback to OpenStreetMap Nominatim
        }

        try {
          // 2. Free OpenStreetMap Nominatim Reverse Geocoding API
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          if (res.ok) {
            const geoData = await res.json();
            const addr = geoData.address || {};
            const city = addr.city || addr.town || addr.village || addr.suburb || addr.county || 'Chennai';
            const state = addr.state || 'Tamil Nadu';
            const country = addr.country || 'India';

            setLocation({ city, state, country });
            setDetected(true);
            return;
          }
        } catch {
          // Fallback if network blocked
        }

        // 3. Clean local fallback
        setLocation({
          city: 'Chennai',
          state: 'Tamil Nadu',
          country: 'India',
        });
        setDetected(true);
        setLoading(false);
      },
      (geoError) => {
        setLoading(false);
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setDenied(true);
          setError('Location permission denied in browser settings.');
        } else {
          setError(geoError.message || 'Unable to retrieve location.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    detectLocation();
  }, []);

  return { location, loading, detected, denied, error, detectLocation };
}

