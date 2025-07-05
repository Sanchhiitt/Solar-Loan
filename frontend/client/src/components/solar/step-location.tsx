import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Crosshair, ChevronRight, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiService, ZipCodeData } from "@/lib/api";

interface StepLocationProps {
  onNext: (data: { zipCode: string; zipCodeData?: ZipCodeData }) => void;
}

export function StepLocation({ onNext }: StepLocationProps) {
  const [zipCode, setZipCode] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [zipCodeData, setZipCodeData] = useState<ZipCodeData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleZipCodeChange = (value: string) => {
    setZipCode(value);
    // Accept both US ZIP codes (5 digits) and India PIN codes (6 digits)
    const valid = /^\d{5}$/.test(value) || /^\d{6}$/.test(value);
    setIsValid(valid);
    setError(null);

    // Clear previous data when ZIP code changes
    if (!valid) {
      setZipCodeData(null);
    }
  };

  // Fetch ZIP code data when a valid ZIP code is entered
  useEffect(() => {
    if (isValid && zipCode) {
      const fetchZipCodeData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await apiService.getZipCodeData(zipCode);
          setZipCodeData(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch location data');
          setZipCodeData(null);
        } finally {
          setIsLoading(false);
        }
      };

      // Debounce the API call
      const timeoutId = setTimeout(fetchZipCodeData, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [zipCode, isValid]);

  const handleSubmit = () => {
    if (isValid) {
      onNext({ zipCode, zipCodeData: zipCodeData || undefined });
    }
  };

  const handleLocationDetect = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      return;
    }

    setIsLocationLoading(true);
    setError(null);

    try {
      // Get user's current position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          }
        );
      });

      const { latitude, longitude } = position.coords;
      console.log(`Location detected: ${latitude}, ${longitude}`);

      // Convert coordinates to ZIP code using reverse geocoding
      const zipCode = await reverseGeocode(latitude, longitude);

      if (zipCode) {
        console.log(`ZIP/PIN code found: ${zipCode}`);
        setZipCode(zipCode);
        setIsValid(true);
        // The useEffect will automatically fetch ZIP code data
      } else {
        console.log('No ZIP/PIN code found for location');
        setError("Could not determine ZIP/PIN code from your location. Please try entering it manually.");
      }
    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError("Location access denied. Please enable location permissions.");
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Location information is unavailable.");
            break;
          case err.TIMEOUT:
            setError("Location request timed out.");
            break;
          default:
            setError("An unknown error occurred while retrieving location.");
            break;
        }
      } else {
        setError("Failed to get your location");
      }
    } finally {
      setIsLocationLoading(false);
    }
  };

  // Function to convert coordinates to ZIP/PIN code with multiple fallbacks
  const reverseGeocode = async (lat: number, lng: number): Promise<string | null> => {
    // Try multiple services for better reliability
    const services = [
      // Service 1: Nominatim (OpenStreetMap)
      async () => {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'SolarLoanChecker/1.0'
            }
          }
        );
        const data = await response.json();
        return data.address?.postcode;
      },

      // Service 2: BigDataCloud
      async () => {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
        );
        const data = await response.json();
        return data.postcode;
      },

      // Service 3: Geocoding API (backup)
      async () => {
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=demo&limit=1`
        );
        const data = await response.json();
        return data.results?.[0]?.components?.postcode;
      }
    ];

    for (const service of services) {
      try {
        const postcode = await service();

        if (postcode) {
          // Handle different postal code formats
          const cleanCode = postcode.toString().trim();

          // US ZIP code (5 digits, optionally with -4 extension)
          if (/^\d{5}(-\d{4})?$/.test(cleanCode)) {
            return cleanCode.split('-')[0]; // Return just 5-digit ZIP
          }

          // India PIN code (6 digits)
          if (/^\d{6}$/.test(cleanCode)) {
            return cleanCode;
          }

          // Other formats - try to extract digits
          const digits = cleanCode.replace(/\D/g, '');
          if (digits.length === 5 || digits.length === 6) {
            return digits;
          }
        }
      } catch (error) {
        console.warn('Geocoding service failed:', error);
        continue; // Try next service
      }
    }

    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">What's your location?</h2>
        <p className="text-gray-300">We need this to check solar incentives in your area</p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="zipCode" className="text-sm font-medium text-white">
            ZIP Code / PIN Code
          </Label>
          <div className="relative">
            <Input
              id="zipCode"
              type="text"
              placeholder="Enter ZIP code (US) or PIN code (India)"
              value={zipCode}
              onChange={(e) => handleZipCodeChange(e.target.value)}
              className={`w-full h-12 px-4 bg-white/10 border ${
                zipCode && !isValid ? 'border-red-500' : 'border-white/20'
              } ${isValid && zipCodeData ? 'border-green-500' : ''} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent transition-all duration-300`}
              maxLength={6}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              {isLoading ? (
                <Loader2 className="text-[#10B981] w-5 h-5 animate-spin" />
              ) : (
                <MapPin className="text-gray-400 w-5 h-5" />
              )}
            </div>
          </div>
          {zipCode && !isValid && (
            <p className="text-red-400 text-sm">Please enter a valid ZIP code (5 digits) or PIN code (6 digits)</p>
          )}
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          {zipCodeData && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
            >
              <p className="text-green-400 text-sm font-medium">
                ✓ Found: {zipCodeData.city}, {zipCodeData.state}
              </p>
              {zipCodeData.average_monthly_bill && (
                <p className="text-gray-300 text-xs">
                  Avg. monthly bill: ${zipCodeData.average_monthly_bill}
                </p>
              )}
            </motion.div>
          )}
        </div>
        
        {/* Auto-detected location option */}
        <motion.div
          className={`flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10 transition-all duration-300 ${
            isLocationLoading ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer hover:bg-white/10'
          }`}
          onClick={isLocationLoading ? undefined : handleLocationDetect}
          whileHover={isLocationLoading ? {} : { scale: 1.02 }}
          whileTap={isLocationLoading ? {} : { scale: 0.98 }}
        >
          {isLocationLoading ? (
            <Loader2 className="text-[#10B981] w-5 h-5 animate-spin" />
          ) : (
            <Crosshair className="text-[#10B981] w-5 h-5" />
          )}
          <div className="flex-1">
            <p className="text-white font-medium">
              {isLocationLoading ? 'Detecting location...' : 'Use my current location'}
            </p>
            <p className="text-gray-400 text-sm">
              {isLocationLoading ? 'Getting your location code' : 'Automatically detect your ZIP/PIN code'}
            </p>
          </div>
          {!isLocationLoading && <ChevronRight className="text-gray-400 w-5 h-5" />}
        </motion.div>
      </div>
      
      {/* Continue Button */}
      <Button
        onClick={handleSubmit}
        disabled={!isValid || isLoading || isLocationLoading || !zipCodeData}
        className="w-full mt-8 h-12 bg-gradient-to-r from-[#F59E0B] to-orange-500 text-white font-semibold rounded-lg hover:from-orange-500 hover:to-[#F59E0B] transform transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <span className="flex items-center justify-center gap-2">
          {isLoading || isLocationLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {isLocationLoading ? 'Detecting location...' : 'Loading location data...'}
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </span>
      </Button>
    </motion.div>
  );
}
