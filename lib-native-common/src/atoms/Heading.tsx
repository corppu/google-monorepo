import { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';
import type { ReactNode } from 'react';
import { useTheme } from '@gm/lib-client-theme';

export const Heading = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        heading: {
          color: theme.colors.ink,
          fontSize: theme.typography.heading,
          fontWeight: theme.typography.headingWeight,
          lineHeight:
            theme.typography.heading * theme.typography.headingLineHeight,
        },
      }),
    [theme],
  );

  return (
    <Text accessibilityRole="header" style={styles.heading}>
      {children}
    </Text>
  );
};
