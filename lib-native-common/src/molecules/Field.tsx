import { useId } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { TextInputProps } from 'react-native';
import { theme } from '@gm/lib-client-theme';
import { Input } from '../atoms/Input';

const styles = StyleSheet.create({
  error: {
    backgroundColor: theme.colors.errorSurface,
    borderLeftColor: theme.colors.errorBorder,
    borderLeftWidth: 3,
    borderRadius: 4,
    color: theme.colors.error,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  field: {
    gap: theme.spacing.field,
  },
  hint: {
    color: theme.colors.mutedInk,
    fontSize: theme.typography.label,
  },
  invalidInput: {
    backgroundColor: theme.colors.errorSurface,
    borderColor: theme.colors.errorBorder,
  },
  label: {
    color: theme.colors.ink,
    fontSize: theme.typography.label,
    fontWeight: theme.typography.labelWeight,
    lineHeight: theme.typography.labelLineHeight,
  },
});

export const Field = ({
  error,
  hint,
  label,
  ...input
}: { error?: string; hint?: string; label: string } & TextInputProps) => {
  const generatedId = useId();
  const fieldId = input.nativeID ?? generatedId;
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;
  const describedBy = [hint ? hintId : undefined, error ? errorId : undefined]
    .filter(Boolean)
    .join(' ');
  const accessibilityHint = [input.accessibilityHint, hint, error]
    .filter(Boolean)
    .join(' ');

  return (
    <View style={styles.field}>
      <Text nativeID={`${fieldId}-label`} style={styles.label}>
        {label}
      </Text>
      <Input
        {...input}
        accessibilityHint={accessibilityHint || undefined}
        accessibilityLabel={input.accessibilityLabel ?? label}
        aria-describedby={describedBy || undefined}
        aria-invalid={Boolean(error)}
        nativeID={fieldId}
        style={[input.style, error ? styles.invalidInput : undefined]}
      />
      {hint && (
        <Text nativeID={hintId} style={styles.hint}>
          {hint}
        </Text>
      )}
      {error && (
        <Text
          accessibilityLiveRegion="assertive"
          accessibilityRole="alert"
          nativeID={errorId}
          style={styles.error}
        >
          {error}
        </Text>
      )}
    </View>
  );
};
