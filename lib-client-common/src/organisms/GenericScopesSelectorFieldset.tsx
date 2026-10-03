import type { ScopeOption } from '../types';
import { GenericScopeArticle } from '../molecules/GenericScopeArticle';

export const GenericScopesSelectorFieldset = ({
  onToggle,
  scopes,
  selected,
}: {
  onToggle: (id: string) => void;
  scopes: ScopeOption[];
  selected: string[];
}) => (
  <fieldset>
    <legend>Scopes</legend>
    {scopes.map((s) => (
      <GenericScopeArticle
        key={s.id}
        scope={s}
        checked={selected.includes(s.id)}
        onToggle={onToggle}
      />
    ))}
  </fieldset>
);
