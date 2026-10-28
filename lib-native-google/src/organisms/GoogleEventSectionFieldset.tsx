import type { Event } from '@gm/lib-common-google';

import { SectionFieldset } from '@gm/lib-native-common';
import { Text } from 'react-native';

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
