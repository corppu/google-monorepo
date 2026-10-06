import type { ScopeOption } from '../types';
import { GenericScopeArticle } from '../molecules/GenericScopeArticle';
import { SectionFieldset } from '../molecules/SectionFieldset';

export const GenericScopesSelectorFieldset = ({
  onToggle,
  scopes,
  selected,
}: {
  onToggle: (id: string) => void;
  scopes: ScopeOption[];
  selected: string[];
}) => (
  <SectionFieldset legend="Scopes">
    {scopes.map((s) => (
      <GenericScopeArticle
        key={s.id}
        scope={s}
        checked={selected.includes(s.id)}
        onToggle={onToggle}
      />
    ))}
  </SectionFieldset>
);
