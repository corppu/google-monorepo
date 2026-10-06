import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { Linking, StyleSheet, Text } from 'react-native';
import type { TextProps } from 'react-native';
import { useTheme } from '@gm/lib-client-theme';

export const Paragraph = ({ children, ...props }: TextProps) => {
  const theme = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        paragraph: {
          color: theme.colors.ink,
          fontSize: theme.typography.body,
          lineHeight: theme.typography.body * 1.45,
        },
      }),
    [theme],
  );

  return (
    <Text {...props} style={styles.paragraph}>
      {children}
    </Text>
  );
};

export const TextLink = ({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) => {
  const theme = useTheme();

  return (
    <Text
      accessibilityRole="link"
      onPress={() => void Linking.openURL(href)}
      style={{
        color: theme.colors.selected,
        textDecorationLine: 'underline',
      }}
    >
      {children}
    </Text>
  );
};
