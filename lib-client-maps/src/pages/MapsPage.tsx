import { useState } from 'react';

import { StyledSection } from '@gm/lib-client-common';

import {
  MapsEurostatSearchParams,
  MapsStatFiSearchParams,
  MapsNlsFiSearchParams,
} from '@gm/lib-contracts-maps';

import { MapsSearchParamsSelectorFormOrganism } from '../organisms/forms/MapsSearchParamsSelectorFormOrganism';
import { MapsOutputOrganism } from '../organisms/maps/MapsOutputOrganism';
import { useClientMapsEurostatStream } from '../hooks/useClientMapsEurostatStream';
import { useClientMapsNlsFiStream } from '../hooks/useClientMapsNlsFiStream';
import { useClientMapsStatFiStream } from '../hooks/useClientMapsStatFiStream';

type AnyParams =
  MapsEurostatSearchParams | MapsStatFiSearchParams | MapsNlsFiSearchParams;

export const MapsPage = () => {
  const [layers, setLayers] = useState<AnyParams[]>([]);

  const startStreamForLayer = (layer: AnyParams) => {
    switch (layer.origin) {
      case 'eurostat':
        return useClientMapsEurostatStream(layer);
      case 'statfi':
        return useClientMapsStatFiStream(layer);
      case 'nlsfi':
        return useClientMapsNlsFiStream(layer);
    }
  };

  const handleSubmit = (next: AnyParams[]) => {
    setLayers(next);
  };

  const streams = layers.map((layer) => startStreamForLayer(layer));

  return (
    <StyledSection as="main">
      <MapsSearchParamsSelectorFormOrganism onSubmit={handleSubmit} />
      <MapsOutputOrganism layers={layers} streams={streams} />
    </StyledSection>
  );
};
