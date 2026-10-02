import { Text, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import { Input } from '../atoms/Input';

export const Field = ({ label, ...input }: { label: string } & TextInputProps) => (
  <View><Text>{label}</Text><Input {...input} /></View>
);
