import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@gm/lib-client-theme';

export const SectionFieldset = ({
  as = 'fieldset',
  children,
  id,
  invalid = false,
  legend,
}: {
  as?: 'article' | 'fieldset';
  children: ReactNode;
  id?: string;
  invalid?: boolean;
  legend: string;
}) => {
  const theme = useTheme();
  const article = as === 'article';
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
          paddingTop: article ? 12 : 24,
          position: 'relative',
        },
        legend: {
          backgroundColor: theme.colors.surface,
          color: theme.colors.ink,
          fontSize: 16,
          fontWeight: theme.typography.headingWeight,
          ...(article
            ? { paddingHorizontal: 4 }
            : {
                left: 8,
                paddingHorizontal: 4,
                position: 'absolute' as const,
                top: -9,
              }),
        },
      }),
    [article, invalid, theme],
  );

  return (
    <View nativeID={id} style={styles.fieldset}>
      <Text
        accessibilityRole={article ? 'header' : undefined}
        aria-level={article ? 3 : undefined}
        style={styles.legend}
      >
        {legend}
      </Text>
      {children}
    </View>
  );
};
