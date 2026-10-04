import { StyleSheet, Text, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import { theme } from '@gm/lib-client-theme';
import { Input } from '../atoms/Input';

const styles = StyleSheet.create({
  field: {
    gap: theme.spacing.field,
  },
  label: {
    color: theme.colors.ink,
    fontSize: theme.typography.label,
    fontWeight: theme.typography.labelWeight,
    lineHeight: theme.typography.labelLineHeight,
  },
});

export const Field = ({
  label,
  ...input
}: { label: string } & TextInputProps) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <Input {...input} />
  </View>
);
