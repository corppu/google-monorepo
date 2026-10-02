import type { ScopeOption } from '../types';
import { GenericScopeArticle } from '../molecules/GenericScopeArticle';

export const GenericScopesSelectorFieldset = ({ scopes, selected, onToggle }: { scopes: ScopeOption[]; selected: string[]; onToggle: (id: string) => void }) => (
  <fieldset>
    <legend>Scopes</legend>
    {scopes.map((s) => (
      <GenericScopeArticle key={s.id} scope={s} checked={selected.includes(s.id)} onToggle={onToggle} />
    ))}
  </fieldset>
);
