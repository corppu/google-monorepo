import { StyleSheet, Text } from 'react-native';
import type { ReactNode } from 'react';
import { theme } from '@gm/lib-client-theme';

const styles = StyleSheet.create({
  heading: {
    color: theme.colors.ink,
    fontSize: theme.typography.heading,
    fontWeight: theme.typography.headingWeight,
    lineHeight: theme.typography.heading * theme.typography.headingLineHeight,
  },
});

export const Heading = ({ children }: { children: ReactNode }) => (
  <Text accessibilityRole="header" style={styles.heading}>
    {children}
  </Text>
);
