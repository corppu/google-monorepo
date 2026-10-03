import type { ScopeOption } from '../types';

export const GenericScopeArticle = ({
  checked,
  onToggle,
  scope,
}: {
  checked: boolean;
  onToggle: (id: string) => void;
  scope: ScopeOption;
}) => (
  <article>
    <label>
      <input
        type="checkbox"
        value={scope.id}
        checked={checked || scope.locked}
        disabled={scope.locked}
        onChange={() => onToggle(scope.id)}
      />
      {scope.label}
      {scope.locked ? ' (required)' : ''}
    </label>
  </article>
);
