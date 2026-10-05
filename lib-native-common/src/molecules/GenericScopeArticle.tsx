import type { ScopeOption } from '../types';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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
  const on = checked || scope.locked;
  const styles = useMemo(
    () =>
      StyleSheet.create({
        box: {
          alignItems: 'center',
          backgroundColor: on ? theme.colors.selected : 'transparent',
          borderColor: on ? theme.colors.selected : theme.colors.border,
          borderRadius: 3,
          borderWidth: 2,
          height: theme.sizes.checkbox,
          justifyContent: 'center',
          marginRight: 2,
          opacity: scope.locked ? 0.5 : 1,
          width: theme.sizes.checkbox,
        },
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
          minHeight: theme.sizes.scopeRow + theme.spacing.scopeRowVertical * 2,
          paddingVertical: theme.spacing.scopeRowVertical,
        },
        tick: {
          color: '#ffffff',
          fontSize: 12,
          fontWeight: '700',
          lineHeight: 14,
        },
      }),
    [theme, on, scope.locked],
  );

  return (
    <View style={styles.row}>
      <Text style={styles.label}>
        {scope.label}
        {scope.locked ? ' (required)' : ''}
      </Text>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityLabel={``}
        accessibilityState={{ checked: on, disabled: scope.locked }}
        disabled={scope.locked}
        onPress={() => onToggle(scope.id)}
        style={styles.box}
      >
        {on ? <Text style={styles.tick}>✓</Text> : null}
      </Pressable>
    </View>
  );
};
