import type { GoogleScope } from '@gm/lib-common-google';
import { GenericScopeArticle } from './GenericScopeArticle';

export const GenericScopesSelectorFieldset = ({ scopes, selected, onToggle }: { scopes: GoogleScope[]; selected: string[]; onToggle: (id: string) => void }) => (
  <fieldset>
    <legend>Scopes</legend>
    {scopes.map((s) => (
      <GenericScopeArticle key={s.id} scope={s} checked={selected.includes(s.id)} onToggle={onToggle} />
    ))}
  </fieldset>
);
