import { Text } from 'react-native';
import type { Group } from '@gm/lib-common-google';
import { Form } from '@gm/lib-native-common';

export const GenericGroupAccessForm = ({ groups }: { groups?: Group[] }) => (
  <Form>
    <Text>Groups</Text>
    {groups?.map((g) => <Text key={g.id}>{g.name}</Text>)}
  </Form>
);
