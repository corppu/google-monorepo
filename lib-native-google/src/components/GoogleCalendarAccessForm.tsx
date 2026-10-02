import { Text } from 'react-native';
import type { CalendarList } from '@gm/lib-common-google';
import { GenericForm } from '@gm/lib-native-common';

export const GoogleCalendarAccessForm = ({ calendars }: { calendars?: CalendarList }) => (
  <GenericForm>
    <Text>Calendars</Text>
    {calendars?.items.map((c) => <Text key={c.id}>{c.summary}</Text>)}
  </GenericForm>
);
