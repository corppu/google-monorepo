import { View } from 'react-native';
import type { ViewProps } from 'react-native';
import { theme } from '@gm/lib-client-theme';

export const GenericForm = (props: ViewProps) => (
  <View
    {...props}
    style={[{ flexDirection: 'column', gap: theme.spacing.field }, props.style]}
  />
);
