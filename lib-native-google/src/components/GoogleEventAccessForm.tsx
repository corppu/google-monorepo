import { Text } from 'react-native';
import type { Event } from '@gm/lib-common-google';
import { GenericForm } from '@gm/lib-native-common';

export const GoogleEventAccessForm = ({ events }: { events?: Event[] }) => (
  <GenericForm>
    <Text>Events</Text>
    {events?.map((e) => <Text key={e.id}>{e.summary}</Text>)}
  </GenericForm>
);
