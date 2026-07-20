"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";

export interface MapMitra {
  id: string;
  orgName: string;
  orgType: string;
  address: string;
  latitude: number;
  longitude: number;
  programs: { id: string; title: string }[];
}

const pinIcon = (color: string) =>
  L.divIcon({
    className: "",
    html: `<div style="
      width:30px;height:30px;border-radius:50% 50% 50% 0;
      background:${color};transform:rotate(-45deg);
      border:2px solid white; box-shadow:0 1px 4px rgba(0,0,0,0.35);
      display:flex;align-items:center;justify-content:center;
    "></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 28],
    popupAnchor: [0, -28],
  });

const ORG_COLOR: Record<string, string> = {
  "Panti Asuhan": "#1e4b3c",
  "Panti Jompo": "#c9962e",
  "Lembaga Sosial": "#2f6b56",
};

export default function MapView({
  mitras,
  center,
}: {
  mitras: MapMitra[];
  center?: [number, number];
}) {
  const defaultCenter: [number, number] = center ?? [-7.2756, 112.7423];

  return (
    <MapContainer
      center={defaultCenter}
      zoom={12}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {mitras.map((m) => (
        <Marker
          key={m.id}
          position={[m.latitude, m.longitude]}
          icon={pinIcon(ORG_COLOR[m.orgType] ?? "#1e4b3c")}
        >
          <Popup>
            <div className="min-w-45 font-sans">
              <p className="text-[11px] font-semibold uppercase text-brand-gold">
                {m.orgType}
              </p>
              <p className="font-display font-semibold text-brand-ink">{m.orgName}</p>
              <p className="mt-0.5 text-xs text-brand-ink-soft">{m.address}</p>
              {m.programs.length > 0 && (
                <div className="mt-2 space-y-1">
                  {m.programs.map((p) => (
                    <Link
                      key={p.id}
                      href={`/program/${p.id}`}
                      className="block text-xs font-medium text-brand-forest-dark underline"
                    >
                      {p.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
