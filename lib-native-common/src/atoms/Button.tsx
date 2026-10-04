import { Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '@gm/lib-client-theme';

const styles = StyleSheet.create({
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
});

export const Button = ({
  onPress,
  title,
}: {
  onPress: () => void;
  title: string;
}) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    style={({ pressed }) => [styles.button, pressed && styles.pressed]}
  >
    <Text style={styles.buttonLabel}>{title}</Text>
  </Pressable>
);
