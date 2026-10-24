import { Text } from 'react-native';
import type { Event } from '@gm/lib-common-google';
import { SectionFieldset } from '@gm/lib-native-common';

export const GoogleEventSectionFieldset = ({
  events,
}: {
  events?: Event[];
}) => (
  <SectionFieldset legend="Events">
    {events?.map((e) => (
      <Text key={e.id}>{e.summary}</Text>
    ))}
  </SectionFieldset>
);
