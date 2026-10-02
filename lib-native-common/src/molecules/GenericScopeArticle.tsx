import type { ScopeOption } from '../types';
import { Switch, Text, View } from 'react-native';

export const GenericScopeArticle = ({ scope, checked, onToggle }: { scope: ScopeOption; checked: boolean; onToggle: (id: string) => void }) => (
  <View>
    <Text>{scope.label}{scope.locked ? ' (required)' : ''}</Text>
    <Switch value={checked || scope.locked} disabled={scope.locked} onValueChange={() => onToggle(scope.id)} />
  </View>
);
