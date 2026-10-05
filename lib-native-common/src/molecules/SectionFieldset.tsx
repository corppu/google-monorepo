import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@gm/lib-client-theme';

export const SectionFieldset = ({
  children,
  id,
  invalid = false,
  legend,
}: {
  children: ReactNode;
  id?: string;
  invalid?: boolean;
  legend: string;
}) => {
  const theme = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        fieldset: {
          backgroundColor: theme.colors.surface,
          borderColor: invalid ? theme.colors.errorBorder : theme.colors.border,
          borderRadius: theme.radius.control,
          borderWidth: 1,
          gap: theme.spacing.field,
          padding: 12,
        },
        legend: {
          color: theme.colors.ink,
          fontSize: 16,
          fontWeight: theme.typography.headingWeight,
          marginBottom: 4,
        },
      }),
    [invalid, theme],
  );

  return (
    <View nativeID={id} style={styles.fieldset}>
      <Text style={styles.legend}>{legend}</Text>
      {children}
    </View>
  );
};
