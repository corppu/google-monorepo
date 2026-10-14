import type { ScopeOption } from '../types';
import './GenericScopeArticle.css';

export const GenericScopeArticle = ({
  checked,
  onToggle,
  scope,
}: {
  checked: boolean;
  onToggle: (id: string) => void;
  scope: ScopeOption;
}) => (
  <article className="gm-client-scope-article">
    <label className="gm-client-scope-article__label">
      <input
        className="gm-client-scope-article__checkbox"
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
