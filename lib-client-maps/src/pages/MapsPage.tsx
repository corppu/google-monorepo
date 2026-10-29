import { StyledSection } from '@gm/lib-client-common';
import {
  MapsEurostatSearchParams,
  MapsStatFiSearchParams,
  MapsNlsFiSearchParams,
} from '@gm/lib-contracts-maps';
import { useState } from 'react';

import { MapsSearchParamsSelectorFormOrganism } from '../organisms/forms/MapsSearchParamsSelectorFormOrganism';
import { MapsOutputOrganism } from '../organisms/maps/MapsOutputOrganism';

type AnyParams =
  MapsEurostatSearchParams | MapsStatFiSearchParams | MapsNlsFiSearchParams;

export const MapsPage = () => {
  const [layers, setLayers] = useState<AnyParams[]>([]);

  const handleSubmit = (next: AnyParams[]) => {
    setLayers(next);
  };

  return (
    <StyledSection as="main">
      <MapsSearchParamsSelectorFormOrganism onSubmit={handleSubmit} />
      <MapsOutputOrganism layers={layers} />
    </StyledSection>
  );
};
