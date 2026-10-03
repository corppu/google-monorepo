import type { ReactNode } from 'react';
import { ScrollView, Text } from 'react-native';

export const ScreenTemplate = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => (
  <ScrollView>
    <Text>{title}</Text>
    {children}
  </ScrollView>
);
