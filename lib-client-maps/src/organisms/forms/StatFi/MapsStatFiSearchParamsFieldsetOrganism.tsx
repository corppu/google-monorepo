import {
  StyledFieldset,
  StyledLegend,
  FieldMolecule,
  StyledSelect,
  StyledInput,
} from '@gm/lib-client-common';

import {
  MapsStatFiSearchParams,
  MapsStatFiSearchParamsSchema,
} from '@gm/lib-contracts-maps';

type Props = {
  onChange: (next: MapsStatFiSearchParams) => void;
  value: MapsStatFiSearchParams;
};

const safeUpdate = (
  next: unknown,
  onChange: (v: MapsStatFiSearchParams) => void,
) => {
  const parsed = MapsStatFiSearchParamsSchema.safeParse(next);
  if (parsed.success) {
    onChange(parsed.data);
  } else {
    console.warn('Invalid StatFi params', parsed.error);
  }
};

export const MapsStatFiSearchParamsFieldsetOrganism = ({
  onChange,
  value,
}: Props) => {
  const handleDataset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    safeUpdate(
      {
        ...value,
        dataset: e.target.value as MapsStatFiSearchParams['dataset'],
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
      <StyledLegend>StatFi Search Parameters</StyledLegend>

      <FieldMolecule id="statfi-dataset" label="Dataset">
        <StyledSelect value={value.dataset} onChange={handleDataset}>
          <option value="municipalities">Municipalities</option>
          <option value="regions">Regions</option>
        </StyledSelect>
      </FieldMolecule>

      <FieldMolecule id="statfi-year" label="Year">
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
