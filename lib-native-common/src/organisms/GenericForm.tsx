import { View } from 'react-native';
import type { ViewProps } from 'react-native';
import { useTheme } from '@gm/lib-client-theme';

export const GenericForm = (props: ViewProps) => {
  const theme = useTheme();
  return (
    <View
      {...props}
      style={[
        { flexDirection: 'column', gap: theme.spacing.field },
        props.style,
      ]}
    />
  );
};
