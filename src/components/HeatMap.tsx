import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TUMKUR_CENTER, VILLAGES, getRiskColor, getRiskLabel, type Hotspot } from '@/utils/mockData';

interface HeatMapProps {
  onSelectHotspot?: (h: Hotspot) => void;
  className?: string;
}

export default function HeatMap({ onSelectHotspot, className = '' }: HeatMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    const map = L.map(mapRef.current, {
      center: TUMKUR_CENTER,
      zoom: 10,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    leafletMapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(map);

    VILLAGES.forEach((v) => {
      const color = getRiskColor(v.risk_score);
      const marker = L.circleMarker([v.lat, v.lng], {
        radius: 12 + v.risk_score * 12,
        color,
        fillColor: color,
        fillOpacity: 0.6,
        weight: 2,
      }).addTo(map);

      marker.bindPopup(`
        <div style="padding: 2px 4px; font-family: Inter, sans-serif;">
          <h3 style="margin: 0 0 4px; font-size: 13px; font-weight: 700;">${v.village_name}</h3>
          <p style="margin: 0; font-size: 12px;">Risk: <strong>${(v.risk_score * 100).toFixed(0)}%</strong> — ${getRiskLabel(v.risk_score)}</p>
          <p style="margin: 0; font-size: 12px;">Temp: ${v.temp}°C | Humidity: ${v.humidity}%</p>
          <p style="margin: 0; font-size: 12px;">Status: ${v.status}</p>
        </div>
      `);

      marker.on('click', () => onSelectHotspot?.(v));
    });

    setTimeout(() => map.invalidateSize(), 100);

    return () => {
      map.remove();
      leafletMapRef.current = null;
    };
  }, [onSelectHotspot]);

  return (
    <div className={`rounded-lg overflow-hidden border shadow-card ${className}`}>
      <div ref={mapRef} style={{ height: '100%', minHeight: 400 }} />
    </div>
  );
}
