import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapMarker {
  lat: number;
  lng: number;
  label: string;
  status?: "pending" | "active" | "completed" | "delayed";
  order?: number;
}

interface RoutePoint {
  lat: number;
  lng: number;
}

interface LeafletMapProps {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  routeLine?: RoutePoint[];
  currentLocation?: { lat: number; lng: number } | null;
  showNavigation?: boolean;
}

const statusColors: Record<string, string> = {
  pending: "#D97706",
  active: "#1D9E75",
  completed: "#059669",
  delayed: "#DC2626",
};

function createNumberedIcon(color: string, number?: number, isCurrentLocation = false) {
  if (isCurrentLocation) {
    return L.divIcon({
      className: "",
      html: `
        <div style="position:relative;width:24px;height:24px;">
          <div style="position:absolute;inset:0;border-radius:50%;background:${color};opacity:0.25;animation:pulse-ring 1.5s ease-out infinite;"></div>
          <div style="position:absolute;inset:4px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  }

  if (number !== undefined) {
    return L.divIcon({
      className: "",
      html: `
        <div style="
          width:28px;height:28px;border-radius:50%;
          background:${color};
          border:3px solid white;
          box-shadow:0 2px 8px ${color}60;
          display:flex;align-items:center;justify-content:center;
          color:white;font-size:12px;font-weight:700;
          font-family:system-ui,sans-serif;
        ">${number}</div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
  }

  return L.divIcon({
    className: "",
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};box-shadow:0 0 8px ${color}80;border:2px solid white;"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

const LeafletMap = ({
  markers,
  center = [-1.2921, 36.8219], // Nairobi default
  zoom = 13,
  className = "",
  routeLine,
  currentLocation,
  showNavigation = false,
}: LeafletMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLineLayerRef = useRef<L.Polyline | null>(null);
  const currentLocationLayerRef = useRef<L.Marker | null>(null);
  const navigationPopupRef = useRef<L.Popup | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center,
      zoom,
      zoomControl: false,
      attributionControl: false,
    });

    L.control.zoom({ position: "topright" }).addTo(map);
    L.control.attribution({ position: "bottomright" }).addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    // Add pulse animation CSS
    const style = document.createElement("style");
    style.textContent = `
      @keyframes pulse-ring {
        0% { transform: scale(1); opacity: 0.25; }
        100% { transform: scale(2.2); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // Sort markers by order if available
    const sorted = [...markers].sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
      if (a.order !== undefined) return -1;
      if (b.order !== undefined) return 1;
      return 0;
    });

    sorted.forEach((m) => {
      const color = statusColors[m.status || "pending"];
      const icon = createNumberedIcon(color, m.order);
      const statusLabel = m.status || "pending";
      const popupHtml = `
        <div style="font-family:system-ui,sans-serif;min-width:120px;">
          <strong style="color:#0F6E56;">${m.order !== undefined ? `#${m.order} ` : ""}${m.label}</strong>
          <br/><span style="color:#666;font-size:12px;text-transform:capitalize;">${statusLabel.replace("_", " ")}</span>
        </div>
      `;
      const marker = L.marker([m.lat, m.lng], { icon })
        .bindPopup(popupHtml);
      markersLayerRef.current!.addLayer(marker);
    });

    if (markers.length > 0 && !showNavigation) {
      const bounds = L.latLngBounds(
        markers.map((m) => [m.lat, m.lng] as [number, number])
      );
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [markers, showNavigation]);

  // Update route line
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (routeLineLayerRef.current) {
      mapInstanceRef.current.removeLayer(routeLineLayerRef.current);
      routeLineLayerRef.current = null;
    }

    if (routeLine && routeLine.length >= 2) {
      const latlngs = routeLine.map((p) => [p.lat, p.lng] as [number, number]);
      const polyline = L.polyline(latlngs, {
        color: "#1D9E75",
        weight: 4,
        opacity: 0.8,
        dashArray: showNavigation ? undefined : "8, 6",
        lineCap: "round",
        lineJoin: "round",
      }).addTo(mapInstanceRef.current);
      routeLineLayerRef.current = polyline;

      if (!showNavigation) {
        mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [40, 40] });
      }
    }
  }, [routeLine, showNavigation]);

  // Update current location
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (currentLocationLayerRef.current) {
      mapInstanceRef.current.removeLayer(currentLocationLayerRef.current);
      currentLocationLayerRef.current = null;
    }

    if (currentLocation && Number.isFinite(currentLocation.lat) && Number.isFinite(currentLocation.lng)) {
      const icon = createNumberedIcon("#2563EB", undefined, true);
      const marker = L.marker([currentLocation.lat, currentLocation.lng], { icon })
        .bindPopup("<strong style='color:#2563EB;'>Your Location</strong>")
        .addTo(mapInstanceRef.current);
      currentLocationLayerRef.current = marker;

      if (showNavigation) {
        mapInstanceRef.current.setView(
          [currentLocation.lat, currentLocation.lng],
          mapInstanceRef.current.getZoom(),
          { animate: true }
        );
      }
    }
  }, [currentLocation, showNavigation]);

  // In navigation mode, show directions popup for next stop
  useEffect(() => {
    if (!mapInstanceRef.current || !showNavigation || !currentLocation) return;

    const pendingMarkers = markers
      .filter((m) => m.status === "pending" || m.status === "active")
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

    if (pendingMarkers.length > 0) {
      const next = pendingMarkers[0];
      const dist = getDistance(currentLocation.lat, currentLocation.lng, next.lat, next.lng);

      if (navigationPopupRef.current) {
        mapInstanceRef.current.removeLayer(navigationPopupRef.current);
      }

      const popup = L.popup({
        closeButton: false,
        autoClose: false,
        closeOnClick: false,
        className: "navigation-popup",
      })
        .setLatLng([next.lat, next.lng])
        .setContent(
          `<div style="font-family:system-ui,sans-serif;padding:4px;">
            <strong style="color:#0F6E56;">Next: ${next.label}</strong><br/>
            <span style="color:#666;font-size:12px;">~${dist.toFixed(1)} km away</span>
          </div>`
        )
        .openOn(mapInstanceRef.current);
      navigationPopupRef.current = popup;
    }
  }, [currentLocation, markers, showNavigation]);

  return (
    <div
      className={`rounded-xl overflow-hidden border border-[#b8e0d4] relative ${className}`}
      style={{ minHeight: "250px", zIndex: 0 }}
    >
      <div ref={mapRef} style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />
    </div>
  );
};

// Haversine distance in km
function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default LeafletMap;
