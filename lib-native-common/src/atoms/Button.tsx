import { useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '@gm/lib-client-theme';

export const Button = ({
  onPress,
  title,
}: {
  onPress: () => void;
  title: string;
}) => {
  const theme = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        button: {
          alignItems: 'center',
          backgroundColor: theme.colors.subtleSurface,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.control,
          borderWidth: 1,
          justifyContent: 'center',
          minHeight: theme.sizes.control,
          paddingHorizontal: theme.spacing.buttonHorizontal,
          paddingVertical: theme.spacing.buttonVertical,
        },
        buttonLabel: {
          color: theme.colors.ink,
          fontSize: theme.typography.body,
          fontWeight: theme.typography.buttonWeight,
          lineHeight: theme.typography.body * 1.4,
        },
        pressed: {
          backgroundColor: theme.colors.pressedSurface,
        },
      }),
    [theme],
  );

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text style={styles.buttonLabel}>{title}</Text>
    </Pressable>
  );
};
