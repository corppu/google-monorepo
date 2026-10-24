import { Text } from 'react-native';
import type { Group } from '@gm/lib-common-google';
import { SectionFieldset } from '@gm/lib-native-common';

export const GoogleGroupSectionFieldset = ({
  groups,
}: {
  groups?: Group[];
}) => (
  <SectionFieldset legend="Groups">
    {groups?.map((g) => (
      <Text key={g.id}>{g.name}</Text>
    ))}
  </SectionFieldset>
);
