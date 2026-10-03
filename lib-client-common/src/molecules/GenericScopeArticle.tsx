import type { ScopeOption } from '../types';
import { theme } from '@gm/lib-client-theme';

export const GenericScopeArticle = ({
  checked,
  onToggle,
  scope,
}: {
  checked: boolean;
  onToggle: (id: string) => void;
  scope: ScopeOption;
}) => (
  <article
    style={{
      borderBottom: `1px solid ${theme.colors.borderSubtle}`,
      margin: 0,
      padding: `${theme.spacing.scopeRowVertical}px 0`,
    }}
  >
    <label
      style={{
        alignItems: 'center',
        color: theme.colors.ink,
        display: 'flex',
        flexDirection: 'row-reverse',
        fontSize: theme.typography.label,
        justifyContent: 'space-between',
        lineHeight: `${theme.typography.labelLineHeight}px`,
        minHeight: theme.sizes.scopeRow,
      }}
    >
      <input
        type="checkbox"
        value={scope.id}
        checked={checked || scope.locked}
        disabled={scope.locked}
        style={{
          accentColor: theme.colors.selected,
          height: theme.sizes.checkbox,
          margin: `0 2px 0 ${theme.spacing.scopeRowHorizontal}px`,
          width: theme.sizes.checkbox,
        }}
        onChange={() => onToggle(scope.id)}
      />
      {scope.label}
      {scope.locked ? ' (required)' : ''}
    </label>
  </article>
);
