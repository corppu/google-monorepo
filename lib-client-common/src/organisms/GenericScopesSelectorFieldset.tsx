import type { ScopeOption } from '../types';
import { GenericScopeArticle } from '../molecules/GenericScopeArticle';
import './GenericScopesSelectorFieldset.css';

export const GenericScopesSelectorFieldset = ({
  onToggle,
  scopes,
  selected,
}: {
  onToggle: (id: string) => void;
  scopes: ScopeOption[];
  selected: string[];
}) => (
  <fieldset className="gm-client-scope-selector">
    <legend className="gm-client-scope-selector__legend">Scopes</legend>
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
