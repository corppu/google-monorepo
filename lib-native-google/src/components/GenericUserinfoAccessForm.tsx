import { Text } from 'react-native';
import type { Userinfo } from '@gm/lib-common-google';
import { Form } from '@gm/lib-native-common';

export const GenericUserinfoAccessForm = ({ userinfo }: { userinfo?: Userinfo }) => (
  <Form>
    <Text>Userinfo</Text>
    <Text>{userinfo?.name} {userinfo?.email}</Text>
  </Form>
);
