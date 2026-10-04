import type { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { useTheme } from '@gm/lib-client-theme';
import { Heading } from '../atoms/Heading';

export const ScreenTemplate = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => {
  const theme = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        content: {
          backgroundColor: theme.colors.surface,
          flexGrow: 1,
          gap: 16,
          padding: 24,
        },
      }),
    [theme],
  );

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Heading>{title}</Heading>
      {children}
    </ScrollView>
  );
};
