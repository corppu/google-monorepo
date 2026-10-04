import type { ScopeOption } from '../types';
import { StyleSheet, Text, View } from 'react-native';
import { GenericScopeArticle } from '../molecules/GenericScopeArticle';
import { theme } from '@gm/lib-client-theme';

const styles = StyleSheet.create({
  fieldset: {
    borderColor: theme.colors.border,
    borderRadius: theme.radius.control,
    borderWidth: 1,
    gap: 4,
    padding: 12,
  },
  legend: {
    color: theme.colors.ink,
    fontSize: theme.typography.label,
    fontWeight: theme.typography.labelWeight,
    marginBottom: 4,
  },
});

export const GenericScopesSelectorFieldset = ({
  onToggle,
  scopes,
  selected,
}: {
  onToggle: (id: string) => void;
  scopes: ScopeOption[];
  selected: string[];
}) => (
  <View style={styles.fieldset}>
    <Text style={styles.legend}>Scopes</Text>
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
