import { View } from 'react-native';
import type { GoogleScope } from '@gm/lib-common-google';
import { GenericScopeArticle } from './GenericScopeArticle';

export const GenericScopesSelectorFieldset = ({ scopes, selected, onToggle }: { scopes: GoogleScope[]; selected: string[]; onToggle: (id: string) => void }) => (
  <View>
    {scopes.map((s) => (
      <GenericScopeArticle key={s.id} scope={s} checked={selected.includes(s.id)} onToggle={onToggle} />
    ))}
  </View>
);
