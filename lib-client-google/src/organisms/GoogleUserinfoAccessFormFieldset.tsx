import type { Userinfo } from '@gm/lib-common-google';

export const GoogleUserinfoAccessFormFieldset = ({
  userinfo,
}: {
  userinfo?: Userinfo;
}) => (
  <fieldset>
    <legend>Userinfo</legend>
    <p>{userinfo?.name}</p>
    <p>{userinfo?.email}</p>
  </fieldset>
);
