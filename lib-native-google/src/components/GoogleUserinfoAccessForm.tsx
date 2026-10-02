import { Text } from 'react-native';
import type { Userinfo } from '@gm/lib-common-google';
import { GenericForm } from '@gm/lib-native-common';

export const GoogleUserinfoAccessForm = ({ userinfo }: { userinfo?: Userinfo }) => (
  <GenericForm>
    <Text>Userinfo</Text>
    <Text>{userinfo?.name} {userinfo?.email}</Text>
  </GenericForm>
);
