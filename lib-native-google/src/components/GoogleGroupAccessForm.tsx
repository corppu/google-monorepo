import { Text } from 'react-native';
import type { Group } from '@gm/lib-common-google';
import { GenericForm } from '@gm/lib-native-common';

export const GoogleGroupAccessForm = ({ groups }: { groups?: Group[] }) => (
  <GenericForm>
    <Text>Groups</Text>
    {groups?.map((g) => (
      <Text key={g.id}>{g.name}</Text>
    ))}
  </GenericForm>
);
