import type { Userinfo } from '@gm/lib-common-google';
import { SectionFieldset } from '@gm/lib-client-common';

export const GoogleUserinfoSectionFieldset = ({
  userinfo,
}: {
  userinfo?: Userinfo;
}) => (
  <SectionFieldset legend="Userinfo">
    <p>{userinfo?.name}</p>
    <p>{userinfo?.email}</p>
  </SectionFieldset>
);
