import { useState, useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, X, Crosshair, Loader2 } from "lucide-react";

interface AddressPickerProps {
  value: string;
  location: { lat: number; lng: number } | null;
  onChange: (address: string) => void;
  onLocationChange: (location: { lat: number; lng: number } | null) => void;
  placeholder?: string;
}

// Fix Leaflet default icon paths
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const NAIROBI_CENTER: [number, number] = [-1.2921, 36.8219];

const AddressPicker = ({
  value,
  location,
  onChange,
  onLocationChange,
  placeholder = "Enter your pickup address...",
}: AddressPickerProps) => {
  const [mapOpen, setMapOpen] = useState(false);
  const [reverseGeocoding, setReverseGeocoding] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    setReverseGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      if (data.display_name) {
        onChange(data.display_name);
      }
    } catch {
      // Geocoding failed, user can type manually
    } finally {
      setReverseGeocoding(false);
    }
  }, [onChange]);

  useEffect(() => {
    if (!mapOpen || !mapRef.current || mapInstanceRef.current) return;

    const initialCenter = location ? [location.lat, location.lng] as [number, number] : NAIROBI_CENTER;
    const initialZoom = location ? 15 : 12;

    const map = L.map(mapRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: false,
      attributionControl: false,
    });

    L.control.zoom({ position: "topright" }).addTo(map);
    L.control.attribution({ position: "bottomright" }).addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // If there's an existing location, place a marker
    if (location) {
      markerRef.current = L.marker(initialCenter).addTo(map);
    }

    // Click to place marker
    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      // Remove old marker
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
      }

      // Place new marker
      markerRef.current = L.marker([lat, lng]).addTo(map);

      // Update state
      onLocationChange({ lat, lng });

      // Reverse geocode
      reverseGeocode(lat, lng);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, [mapOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-place marker if location changes externally
  useEffect(() => {
    if (!mapInstanceRef.current || !location || !mapOpen) return;

    if (markerRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
    }

    markerRef.current = L.marker([location.lat, location.lng]).addTo(mapInstanceRef.current);
    mapInstanceRef.current.setView([location.lat, location.lng], 15);
  }, [location, mapOpen]);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) return;

    setReverseGeocoding(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        onLocationChange({ lat, lng });

        // If map is open, place marker
        if (mapInstanceRef.current) {
          if (markerRef.current) {
            mapInstanceRef.current.removeLayer(markerRef.current);
          }
          markerRef.current = L.marker([lat, lng]).addTo(mapInstanceRef.current);
          mapInstanceRef.current.setView([lat, lng], 15);
        }

        reverseGeocode(lat, lng);
      },
      () => {
        setReverseGeocoding(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleClearLocation = () => {
    onLocationChange(null);
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <MapPin
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
            style={{ color: reverseGeocoding ? "#D97706" : "#6B9E8A" }}
          />
          <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pl-10 h-11 border-[#b8e0d4] bg-[#F6FAFA] focus:border-[#1D9E75]"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-11 w-11 shrink-0 border-[#b8e0d4] hover:bg-[#E1F5EE]"
          onClick={() => setMapOpen(!mapOpen)}
          title={mapOpen ? "Close map" : "Pin on map"}
        >
          {mapOpen ? (
            <X className="h-4 w-4" style={{ color: "#D97706" }} />
          ) : (
            <MapPin className="h-4 w-4" style={{ color: "#1D9E75" }} />
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-11 w-11 shrink-0 border-[#b8e0d4] hover:bg-[#E1F5EE]"
          onClick={handleGetCurrentLocation}
          disabled={reverseGeocoding}
          title="Use my current location"
        >
          {reverseGeocoding ? (
            <Loader2 className="h-4 w-4 animate-spin" style={{ color: "#D97706" }} />
          ) : (
            <Crosshair className="h-4 w-4" style={{ color: "#0EA5E9" }} />
          )}
        </Button>
      </div>

      {/* Location indicator */}
      {location && (
        <div className="flex items-center gap-2 text-xs text-[#6B9E8A]">
          <MapPin className="h-3 w-3" />
          <span>
            Pinned at {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
          </span>
          <button
            type="button"
            className="text-destructive hover:underline ml-1"
            onClick={handleClearLocation}
          >
            Remove
          </button>
        </div>
      )}

      {/* Map panel */}
      {mapOpen && (
        <div className="rounded-xl border border-[#b8e0d4] overflow-hidden">
          <div
            ref={mapRef}
            className="w-full"
            style={{ height: "220px" }}
          />
          <div className="bg-[#F6FAFA] border-t border-[#b8e0d4] px-3 py-2 text-xs text-[#444441]">
            Click anywhere on the map to pin your pickup location, or use the crosshair button for your current location.
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressPicker;
