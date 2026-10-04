import { StyleSheet, TextInput } from 'react-native';
import type { TextInputProps } from 'react-native';
import { theme } from '@gm/lib-client-theme';

const styles = StyleSheet.create({
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.control,
    borderWidth: 1,
    color: theme.colors.ink,
    fontSize: theme.typography.body,
    lineHeight: theme.typography.body * 1.45,
    minHeight: theme.sizes.control,
    paddingHorizontal: theme.spacing.inputHorizontal,
    paddingVertical: theme.spacing.inputVertical,
    width: '100%',
  },
});

export const Input = (props: TextInputProps) => (
  <TextInput
    autoCapitalize="none"
    {...props}
    style={[styles.input, props.style]}
  />
);
