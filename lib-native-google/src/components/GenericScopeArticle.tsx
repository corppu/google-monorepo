import { Switch, Text, View } from 'react-native';
import type { GoogleScope } from '@gm/lib-common-google';

export const GenericScopeArticle = ({ scope, checked, onToggle }: { scope: GoogleScope; checked: boolean; onToggle: (id: string) => void }) => (
  <View>
    <Text>{scope.label}{scope.locked ? ' (required)' : ''}</Text>
    <Switch value={checked || scope.locked} disabled={scope.locked} onValueChange={() => onToggle(scope.id)} />
  </View>
);
