"use client";

import dynamic from "next/dynamic";

const MapViewLoader = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-brand-ink-soft">
      Memuat peta...
    </div>
  ),
});

export default MapViewLoader;
