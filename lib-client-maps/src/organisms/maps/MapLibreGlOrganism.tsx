import { useEffect, useRef } from 'react';
import { Map } from 'maplibre-gl';

type StreamState = {
  data: any[];
  error: unknown;
  id: string; // <-- REQUIRED
  loading: boolean;
};

type Props = {
  streams: StreamState[];
};

export const MapLibreGlOrganism = ({ streams }: Props) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<Map | null>(null);

  //
  // 1. Initialize MapLibre once
  //
  useEffect(() => {
    if (!mapRef.current) return;

    mapInstance.current = new Map({
      center: [24.94, 60.17], // Helsinki
      container: mapRef.current,
      style: 'https://demotiles.maplibre.org/style.json',
      zoom: 5,
    });

    return () => {
      mapInstance.current?.remove();
    };
  }, []);

  //
  // 2. Update layers when streams change
  //
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    streams.forEach((stream) => {
      const sourceId = `stream-source-${stream.id}`;
      const layerId = `stream-layer-${stream.id}`;

      const features = stream.data ?? [];

      // Remove old layer + source if they exist
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }

      // Add new source
      map.addSource(sourceId, {
        data: {
          features,
          type: 'FeatureCollection',
        },
        type: 'geojson',
      });

      // Add new layer
      map.addLayer({
        id: layerId,
        paint: {
          'fill-color': [
            'case',
            ['==', ['get', 'origin'], 'eurostat'],
            '#1e90ff',
            ['==', ['get', 'origin'], 'statfi'],
            '#32cd32',
            ['==', ['get', 'origin'], 'nlsfi'],
            '#ff8c00',
            '#cccccc',
          ],
          'fill-opacity': 0.5,
        },
        source: sourceId,
        type: 'fill',
      });
    });
  }, [streams]);

  return <div ref={mapRef} className="fullscreen" />;
};
