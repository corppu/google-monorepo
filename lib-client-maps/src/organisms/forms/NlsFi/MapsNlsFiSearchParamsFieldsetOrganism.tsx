import {
  StyledFieldset,
  StyledLegend,
  FieldMolecule,
  StyledSelect,
  StyledInput,
} from '@gm/lib-client-common';

import {
  MapsNlsFiSearchParams,
  MapsNlsFiSearchParamsSchema,
} from '@gm/lib-contracts-maps';

type Props = {
  onChange: (next: MapsNlsFiSearchParams) => void;
  value: MapsNlsFiSearchParams;
};

const safeUpdate = (
  next: unknown,
  onChange: (v: MapsNlsFiSearchParams) => void,
) => {
  const parsed = MapsNlsFiSearchParamsSchema.safeParse(next);
  if (parsed.success) {
    onChange(parsed.data);
  } else {
    console.warn('Invalid NLSFI params', parsed.error);
  }
};

export const MapsNlsFiSearchParamsFieldsetOrganism = ({
  onChange,
  value,
}: Props) => {
  const handleDataset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    safeUpdate(
      {
        ...value,
        dataset: e.target.value as MapsNlsFiSearchParams['dataset'],
      },
      onChange,
    );
  };

  const handleYear = (e: React.ChangeEvent<HTMLInputElement>) => {
    safeUpdate(
      {
        ...value,
        year: Number(e.target.value),
      },
      onChange,
    );
  };

  return (
    <StyledFieldset>
      <StyledLegend>NLSFI Search Parameters</StyledLegend>

      <FieldMolecule id="nlsfi-dataset" label="Dataset">
        <StyledSelect value={value.dataset} onChange={handleDataset}>
          <option value="municipalities">Municipalities</option>
          <option value="administrative_areas">Administrative Areas</option>
        </StyledSelect>
      </FieldMolecule>

      <FieldMolecule id="nlsfi-year" label="Year">
        <StyledInput
          type="number"
          value={value.year}
          min={1900}
          max={2100}
          onChange={handleYear}
        />
      </FieldMolecule>
    </StyledFieldset>
  );
};
