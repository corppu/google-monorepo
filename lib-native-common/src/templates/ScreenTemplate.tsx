import type { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { theme } from '@gm/lib-client-theme';
import { Heading } from '../atoms/Heading';

const styles = StyleSheet.create({
  content: {
    backgroundColor: theme.colors.surface,
    gap: 16,
    padding: 24,
  },
});

export const ScreenTemplate = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => (
  <ScrollView contentContainerStyle={styles.content}>
    <Heading>{title}</Heading>
    {children}
  </ScrollView>
);
