import { Text } from 'react-native';
import type { Event } from '@gm/lib-common-google';
import { Form } from '@gm/lib-native-common';

export const GenericEventAccessForm = ({ events }: { events?: Event[] }) => (
  <Form>
    <Text>Events</Text>
    {events?.map((e) => <Text key={e.id}>{e.summary}</Text>)}
  </Form>
);
