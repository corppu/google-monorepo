import type { ScopeOption } from '../types';
import { View } from 'react-native';
import { GenericScopeArticle } from '../molecules/GenericScopeArticle';

export const GenericScopesSelectorFieldset = ({ scopes, selected, onToggle }: { scopes: ScopeOption[]; selected: string[]; onToggle: (id: string) => void }) => (
  <View>
    {scopes.map((s) => (
      <GenericScopeArticle key={s.id} scope={s} checked={selected.includes(s.id)} onToggle={onToggle} />
    ))}
  </View>
);
