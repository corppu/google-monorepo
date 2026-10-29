import { Map, setWorkerUrl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import { useRef, useEffect } from 'react';

setWorkerUrl(workerUrl);

type StreamState = {
  data: any[];
  error: unknown;
  id: string;
  loading: boolean;
};

type Props = {
  streams: StreamState[];
};

export const MapLibreGlOrganism = ({ streams }: Props) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<Map | null>(null);
  const mapLoaded = useRef(false);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new Map({
      center: [24.94, 60.17],
      container: mapRef.current,
      style: 'https://demotiles.maplibre.org/style.json',
      zoom: 5,
    });

    map.on('load', () => {
      mapLoaded.current = true;
    });

    mapInstance.current = map;

    return () => map.remove();
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !mapLoaded.current) return;

    streams.forEach((stream) => {
      const sourceId = `stream-source-${stream.id}`;
      const fillId = `stream-layer-${stream.id}`;
      const outlineId = `${fillId}-outline`;

      // REMOVE OUTLINE FIRST
      if (map.getLayer(outlineId)) {
        map.removeLayer(outlineId);
      }

      // REMOVE FILL SECOND
      if (map.getLayer(fillId)) {
        map.removeLayer(fillId);
      }

      // REMOVE SOURCE LAST
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }

      // ADD SOURCE
      map.addSource(sourceId, {
        data: {
          features: stream.data ?? [],
          type: 'FeatureCollection',
        },
        type: 'geojson',
      });

      // ADD FILL LAYER
      map.addLayer({
        id: fillId,
        paint: {
          'fill-antialias': true,
          'fill-color': [
            'case',
            ['==', ['get', 'LEVL_CODE'], 2],
            '#f2c94c',
            ['==', ['get', 'LEVL_CODE'], 3],
            '#6fcf97',
            '#bbdefb',
          ],
          'fill-opacity': 0.35,
        },
        source: sourceId,
        type: 'fill',
      });

      // ADD OUTLINE LAYER
      map.addLayer({
        id: outlineId,
        paint: {
          'line-blur': 0.2,
          'line-color': [
            'case',
            ['==', ['get', 'LEVL_CODE'], 2],
            '#000000',
            ['==', ['get', 'LEVL_CODE'], 3],
            '#333333',
            '#555555',
          ],
          'line-opacity': 0.9,
          'line-width': [
            'case',
            ['==', ['get', 'LEVL_CODE'], 2],
            3.5,
            ['==', ['get', 'LEVL_CODE'], 3],
            2.5,
            1.5,
          ],
        },
        source: sourceId,
        type: 'line',
      });
    });
  }, [streams]);

  return <div ref={mapRef} className="fullscreen" />;
};
