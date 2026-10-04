import type { ScopeOption } from '../types';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GenericScopeArticle } from '../molecules/GenericScopeArticle';
import { useTheme } from '@gm/lib-client-theme';

export const GenericScopesSelectorFieldset = ({
  onToggle,
  scopes,
  selected,
}: {
  onToggle: (id: string) => void;
  scopes: ScopeOption[];
  selected: string[];
}) => {
  const theme = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        fieldset: {
          backgroundColor: theme.colors.surface,
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
      }),
    [theme],
  );

  return (
    <View style={styles.fieldset}>
      <Text style={styles.legend}>Scopes</Text>
      {scopes.map((scope) => (
        <GenericScopeArticle
          key={scope.id}
          scope={scope}
          checked={selected.includes(scope.id)}
          onToggle={onToggle}
        />
      ))}
    </View>
  );
};
