import type { ScopeOption } from '../types';
import { useMemo } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { useTheme } from '@gm/lib-client-theme';

export const GenericScopeArticle = ({
  checked,
  onToggle,
  scope,
}: {
  checked: boolean;
  onToggle: (id: string) => void;
  scope: ScopeOption;
}) => {
  const theme = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        label: {
          color: theme.colors.ink,
          flex: 1,
          fontSize: theme.typography.label,
          lineHeight: theme.typography.labelLineHeight,
        },
        row: {
          alignItems: 'center',
          borderBottomColor: theme.colors.borderSubtle,
          borderBottomWidth: 1,
          flexDirection: 'row',
          gap: theme.spacing.scopeRowHorizontal,
          justifyContent: 'space-between',
          minHeight: theme.sizes.scopeRow,
          paddingVertical: theme.spacing.scopeRowVertical,
        },
      }),
    [theme],
  );

  return (
    <View style={styles.row}>
      <Text style={styles.label}>
        {scope.label}
        {scope.locked ? ' (required)' : ''}
      </Text>
      <Switch
        accessibilityLabel={`${scope.label}${scope.locked ? ' (required)' : ''}`}
        value={checked || scope.locked}
        disabled={scope.locked}
        thumbColor={checked ? theme.colors.selected : theme.colors.scopeThumb}
        trackColor={{
          false: theme.colors.scopeTrack,
          true: theme.colors.scopeTrackActive,
        }}
        onValueChange={() => onToggle(scope.id)}
      />
    </View>
  );
};
