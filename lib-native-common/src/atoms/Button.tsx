import { Pressable, Text } from 'react-native';

export const Button = ({
  onPress,
  title,
}: {
  onPress: () => void;
  title: string;
}) => (
  <Pressable onPress={onPress}>
    <Text>{title}</Text>
  </Pressable>
);
