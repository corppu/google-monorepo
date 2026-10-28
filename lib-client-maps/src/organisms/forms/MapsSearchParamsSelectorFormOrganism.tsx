import {
  StyledSection,
  StyledForm,
  StyledHeading,
  StyledButton,
} from '@gm/lib-client-common';
import {
  MapsEurostatSearchParams,
  MapsStatFiSearchParams,
  MapsNlsFiSearchParams,
  SupportedNutsYears,
} from '@gm/lib-contracts-maps';
import { useMemo, useState } from 'react';

import { MapsEurostatSearchParamsFieldsetOrganism } from './Eurostat/MapsEurostatSearchParamsFieldsetOrganism';
import { MapsNlsFiSearchParamsFieldsetOrganism } from './NlsFi/MapsNlsFiSearchParamsFieldsetOrganism';
import { MapsStatFiSearchParamsFieldsetOrganism } from './StatFi/MapsStatFiSearchParamsFieldsetOrganism';

const hasLayer = (next: AnyParams, layers: AnyParams[]) =>
  layers.some((l) => JSON.stringify(l) === JSON.stringify(next));

type AnyParams =
  MapsEurostatSearchParams | MapsStatFiSearchParams | MapsNlsFiSearchParams;

type Props = {
  onSubmit: (params: AnyParams[]) => void;
};

export const MapsSearchParamsSelectorFormOrganism = ({ onSubmit }: Props) => {
  const [layers, setLayers] = useState<AnyParams[]>([]);

  const addEurostat = () => {
    const next: MapsEurostatSearchParams = {
      countries: ['FI'],
      dataset: 'nuts',
      nutsLevel: 0,
      origin: 'eurostat',
      year: SupportedNutsYears[SupportedNutsYears.length - 1],
    };

    if (!hasLayer(next, layers)) {
      setLayers((prev) => [...prev, next]);
    }
  };

  const addStatFi = () => {
    const next: MapsStatFiSearchParams = {
      dataset: 'municipalities',
      origin: 'statfi',
      year: new Date().getFullYear() - 1,
    };

    if (!hasLayer(next, layers)) {
      setLayers((prev) => [...prev, next]);
    }
  };

  const addNlsfi = () => {
    const next: MapsNlsFiSearchParams = {
      dataset: 'municipalities',
      origin: 'nlsfi',
      year: new Date().getFullYear() - 1,
    };

    if (!hasLayer(next, layers)) {
      setLayers((prev) => [...prev, next]);
    }
  };

  const updateLayer = (index: number, next: AnyParams) => {
    setLayers((prev) => {
      const copy = [...prev];
      copy[index] = next;
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(layers);
  };

  return (
    <StyledSection>
      <StyledForm onSubmit={handleSubmit}>
        <StyledHeading as="h2">Map Search Parameters</StyledHeading>

        <StyledButton type="button" onClick={addEurostat}>
          Add Eurostat Layer
        </StyledButton>

        <StyledButton type="button" onClick={addStatFi}>
          Add StatFi Layer
        </StyledButton>

        <StyledButton type="button" onClick={addNlsfi}>
          Add NlsFi Layer
        </StyledButton>

        {layers.map((layer, i) => {
          if (layer.origin === 'eurostat') {
            return (
              <MapsEurostatSearchParamsFieldsetOrganism
                key={i}
                value={layer as MapsEurostatSearchParams}
                onChange={(next) => updateLayer(i, next)}
              />
            );
          }

          if (layer.origin === 'statfi') {
            return (
              <MapsStatFiSearchParamsFieldsetOrganism
                key={i}
                value={layer as MapsStatFiSearchParams}
                onChange={(next) => updateLayer(i, next)}
              />
            );
          }

          return (
            <MapsNlsFiSearchParamsFieldsetOrganism
              key={i}
              value={layer as MapsNlsFiSearchParams}
              onChange={(next) => updateLayer(i, next)}
            />
          );
        })}

        <StyledButton type="submit">Apply Search Parameters</StyledButton>
      </StyledForm>
    </StyledSection>
  );
};
