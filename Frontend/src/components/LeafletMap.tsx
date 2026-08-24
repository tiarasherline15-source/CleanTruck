import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapMarker {
  lat: number;
  lng: number;
  label: string;
  status?: "pending" | "active" | "completed" | "delayed";
}

interface LeafletMapProps {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

const statusColors: Record<string, string> = {
  pending: "#D97706",
  active: "#1D9E75",
  completed: "#059669",
  delayed: "#DC2626",
};

function createIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="width:12px;height:12px;border-radius:50%;background:${color};box-shadow:0 0 8px ${color}80;border:2px solid white;"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

const LeafletMap = ({
  markers,
  center = [-1.2921, 36.8219], // Nairobi default
  zoom = 12,
  className = "",
}: LeafletMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

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

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    markers.forEach((m) => {
      const color = statusColors[m.status || "pending"];
      const marker = L.marker([m.lat, m.lng], { icon: createIcon(color) })
        .bindPopup(`<strong>${m.label}</strong><br/>Status: ${m.status || "pending"}`);
      markersLayerRef.current!.addLayer(marker);
    });

    if (markers.length > 0) {
      const bounds = L.latLngBounds(
        markers.map((m) => [m.lat, m.lng] as [number, number])
      );
      mapInstanceRef.current.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [markers]);

  return (
    <div
      className={`rounded-xl overflow-hidden border border-[#b8e0d4] relative ${className}`}
      style={{ minHeight: "250px", zIndex: 0 }}
    >
      <div ref={mapRef} style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />
    </div>
  );
};

export default LeafletMap;
