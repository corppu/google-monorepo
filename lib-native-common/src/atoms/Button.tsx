import { Pressable, Text } from 'react-native';

export const Button = ({ title, onPress }: { title: string; onPress: () => void }) => (
  <Pressable onPress={onPress}><Text>{title}</Text></Pressable>
);
