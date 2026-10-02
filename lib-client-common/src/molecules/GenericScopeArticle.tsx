import type { ScopeOption } from '../types';

export const GenericScopeArticle = ({ scope, checked, onToggle }: { scope: ScopeOption; checked: boolean; onToggle: (id: string) => void }) => (
  <article>
    <label>
      <input type="checkbox" value={scope.id} checked={checked || scope.locked} disabled={scope.locked} onChange={() => onToggle(scope.id)} />
      {scope.label}
      {scope.locked ? ' (required)' : ''}
    </label>
  </article>
);
