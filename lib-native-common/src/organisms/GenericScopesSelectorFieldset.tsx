import type { ScopeOption } from '../types';
import { View } from 'react-native';
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
  <View>
    {scopes.map((s) => (
      <GenericScopeArticle
        key={s.id}
        scope={s}
        checked={selected.includes(s.id)}
        onToggle={onToggle}
      />
    ))}
  </View>
);
