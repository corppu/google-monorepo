import { StyledSection, StyledHeading } from '@gm/lib-client-common';

import {
  AnyParams,
  useClientMapsStreams,
} from '../../hooks/useClientMapsStreams';
import { MapLibreGlOrganism } from './MapLibreGlOrganism';

type Props = {
  layers: AnyParams[];
};

export const MapsOutputOrganism = ({ layers }: Props) => {
  const streams = useClientMapsStreams(layers);

  return (
    <StyledSection as="section" fullScreen id="map-output">
      <StyledHeading as="h2">Map</StyledHeading>

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
        {streams.map((stream) => (
          <li key={stream.id}>
            {(stream.loading && <div>Loading…</div>) || (
              <div>Loaded total of {stream.data.length} features</div>
            )}
            {Boolean(stream.error) && <div>{JSON.stringify(stream.error)}</div>}
          </li>
        ))}
      </ul>

      <MapLibreGlOrganism streams={streams} />
    </StyledSection>
  );
};
