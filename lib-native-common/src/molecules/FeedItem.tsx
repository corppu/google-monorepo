import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@gm/lib-client-theme';
import { TextLink } from '../atoms/Paragraph';

export const FeedItem = ({
  dateTimeEndLocalized,
  dateTimeLocalized,
  description,
  locationHref,
  locationText,
  title,
}: {
  dateTimeEndLocalized?: string;
  dateTimeISO?: string;
  dateTimeLocalized?: string;
  description?: ReactNode;
  locationHref?: string;
  locationText?: ReactNode;
  title: ReactNode;
}) => {
  const theme = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        body: {
          color: theme.colors.ink,
          fontSize: theme.typography.body,
          lineHeight: theme.typography.body * 1.45,
        },
        heading: {
          color: theme.colors.ink,
          fontSize: theme.typography.heading,
          fontWeight: theme.typography.headingWeight,
          lineHeight:
            theme.typography.heading * theme.typography.headingLineHeight,
          marginBottom: theme.spacing.field,
        },
      }),
    [theme],
  );

  return (
    <View>
      <Text accessibilityRole="header" aria-level={4} style={styles.heading}>
        {dateTimeLocalized}
        {'\n'}
        {title}
      </Text>
      <Text style={styles.body}>
        {description}
        {'\n'}
        {locationHref ? (
          <TextLink href={locationHref}>{locationText}</TextLink>
        ) : (
          locationText
        )}
        {'\n'}
        {dateTimeLocalized}
        {'\n'}
        {dateTimeEndLocalized}
      </Text>
    </View>
  );
};
