import { Text } from 'react-native';
import type { CalendarList } from '@gm/lib-common-google';
import { Form } from '@gm/lib-native-common';

export const GenericCalendarAccessForm = ({ calendars }: { calendars?: CalendarList }) => (
  <Form>
    <Text>Calendars</Text>
    {calendars?.items.map((c) => <Text key={c.id}>{c.summary}</Text>)}
  </Form>
);
