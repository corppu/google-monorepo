import { Text } from 'react-native';
import type { CalendarList } from '@gm/lib-common-google';
import { SectionFieldset } from '@gm/lib-native-common';

export const GoogleCalendarSectionFieldset = ({
  calendars,
}: {
  calendars?: CalendarList;
}) => (
  <SectionFieldset legend="Calendars">
    {calendars?.items.map((c) => (
      <Text key={c.id}>{c.summary}</Text>
    ))}
  </SectionFieldset>
);
