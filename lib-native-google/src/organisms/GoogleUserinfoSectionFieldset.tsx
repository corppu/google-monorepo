import { Text } from 'react-native';
import type { Userinfo } from '@gm/lib-common-google';
import { SectionFieldset } from '@gm/lib-native-common';

export const GoogleUserinfoSectionFieldset = ({
  userinfo,
}: {
  userinfo?: Userinfo;
}) => (
  <SectionFieldset legend="Userinfo">
    <Text>
      {userinfo?.name} {userinfo?.email}
    </Text>
  </SectionFieldset>
);
