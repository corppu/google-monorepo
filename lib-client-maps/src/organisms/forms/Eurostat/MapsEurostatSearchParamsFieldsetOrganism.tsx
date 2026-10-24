import {
  StyledFieldset,
  StyledLegend,
  FieldMolecule,
  StyledSelect,
  StyledInput,
} from '@gm/lib-client-common';

import {
  CountryCode,
  CountryCodeEnum,
  MapsEurostatSearchParams,
  MapsEurostatSearchParamsSchema,
  SupportedLauYears,
  SupportedNutsYears,
} from '@gm/lib-contracts-maps';

type Props = {
  onChange: (next: MapsEurostatSearchParams) => void;
  value: MapsEurostatSearchParams;
};

const safeUpdate = (
  next: unknown,
  onChange: (v: MapsEurostatSearchParams) => void,
) => {
  const parsed = MapsEurostatSearchParamsSchema.safeParse(next);
  if (parsed.success) {
    onChange(parsed.data);
  } else {
    console.warn('Invalid Eurostat params', parsed.error);
  }
};

export const MapsEurostatSearchParamsFieldsetOrganism = ({
  onChange,
  value,
}: Props) => {
  const handleDataset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dataset = e.target.value as MapsEurostatSearchParams['dataset'];

    const next: MapsEurostatSearchParams =
      dataset === 'nuts'
        ? {
            countries: value.countries ?? [],
            dataset: 'nuts',
            nutsLevel: value.nutsLevel ?? 0,
            origin: 'eurostat',
            year:
              value.dataset === 'nuts'
                ? value.year
                : SupportedNutsYears[SupportedNutsYears.length - 1],
          }
        : {
            countries: value.countries ?? [],
            dataset: 'lau',
            origin: 'eurostat',
            year:
              value.dataset === 'lau'
                ? value.year
                : SupportedLauYears[SupportedLauYears.length - 1],
          };

    safeUpdate(next, onChange);
  };

  const handleYear = (e: React.ChangeEvent<HTMLSelectElement>) => {
    safeUpdate(
      {
        ...value,
        year: Number(e.target.value),
      },
      onChange,
    );
  };

  const handleCountries = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected: CountryCode[] = Array.from(e.target.selectedOptions)
      .map((o) => o.value)
      .filter((v): v is CountryCode =>
        CountryCodeEnum._def.values.includes(v as CountryCode),
      );

    safeUpdate(
      {
        ...value,
        countries: selected,
      },
      onChange,
    );
  };

  const handleNutsLevel = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (value.dataset !== 'nuts') return;

    safeUpdate(
      {
        ...value,
        nutsLevel: Number(
          e.target.value,
        ) as MapsEurostatSearchParams['nutsLevel'],
      },
      onChange,
    );
  };

  const years =
    value.dataset === 'nuts' ? SupportedNutsYears : SupportedLauYears;

  return (
    <StyledFieldset>
      <StyledLegend>Eurostat Search Parameters</StyledLegend>

      <FieldMolecule id="eurostat-dataset" label="Dataset">
        <StyledSelect value={value.dataset} onChange={handleDataset}>
          <option value="nuts">NUTS</option>
          <option value="lau">LAU</option>
        </StyledSelect>
      </FieldMolecule>

      <FieldMolecule id="eurostat-countries" label="Countries">
        <StyledSelect
          multiple
          value={value.countries ?? []}
          onChange={handleCountries}
        >
          {CountryCodeEnum._def.values.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </StyledSelect>
      </FieldMolecule>

      <FieldMolecule id="eurostat-year" label="Year">
        <StyledSelect value={value.year} onChange={handleYear}>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </StyledSelect>
      </FieldMolecule>

      {value.dataset === 'nuts' && (
        <FieldMolecule id="eurostat-nuts-level" label="NUTS Level">
          <StyledSelect value={value.nutsLevel ?? 0} onChange={handleNutsLevel}>
            <option value={0}>Level 0</option>
            <option value={1}>Level 1</option>
            <option value={2}>Level 2</option>
            <option value={3}>Level 3</option>
          </StyledSelect>
        </FieldMolecule>
      )}
    </StyledFieldset>
  );
};
