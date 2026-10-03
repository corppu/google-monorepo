import { TextInput } from 'react-native';
import type { TextInputProps } from 'react-native';

export const Input = (props: TextInputProps) => (
  <TextInput autoCapitalize="none" {...props} />
);
