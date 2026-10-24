import { StyledSection, StyledHeading } from '@gm/lib-client-common';

import {
  MapsEurostatSearchParams,
  MapsStatFiSearchParams,
  MapsNlsFiSearchParams,
} from '@gm/lib-contracts-maps';

type AnyParams =
  MapsEurostatSearchParams | MapsStatFiSearchParams | MapsNlsFiSearchParams;

type StreamState = {
  data: any[];
  error: unknown;
  loading: boolean;
};

type Props = {
  layers: AnyParams[];
  streams: StreamState[];
};

export const MapsOutputOrganism = ({ layers, streams }: Props) => {
  return (
    <StyledSection as="section" fullScreen id="map-output">
      <StyledHeading as="h2">Map</StyledHeading>

      {/* MapLibre goes here */}
      {/* <MapLibreMap features={streams.flatMap(s => s.data)} /> */}

      <StyledHeading as="h3">Legend</StyledHeading>
      <ul>
        {layers.map((layer, i) => (
          <li key={`legend-${i}`}>
            {layer.origin} – {layer.dataset} – {layer.year}
          </li>
        ))}
      </ul>

      <StyledHeading as="h3">Streamed Features</StyledHeading>
      <ul>
        {streams.map((stream, i) => (
          <li key={`stream-${i}`}>
            {stream.loading && <div>Loading…</div>}
            {Boolean(stream.error) && <div>{JSON.stringify(stream.error)}</div>}
            {stream.data.length > 0 && (
              <code>{JSON.stringify(stream.data, null, 2)}</code>
            )}
          </li>
        ))}
      </ul>
    </StyledSection>
  );
};
