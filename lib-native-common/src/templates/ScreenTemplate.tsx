import type { ReactNode } from 'react';
import { ScrollView, Text } from 'react-native';

export const ScreenTemplate = ({ title, children }: { title: string; children: ReactNode }) => (
  <ScrollView><Text>{title}</Text>{children}</ScrollView>
);
