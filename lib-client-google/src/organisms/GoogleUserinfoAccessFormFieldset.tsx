import type { Userinfo } from '@gm/lib-common-google';
import './GoogleAccessFormFieldset.css';

export const GoogleUserinfoAccessFormFieldset = ({
  userinfo,
}: {
  userinfo?: Userinfo;
}) => (
  <fieldset className="gm-google-access-fieldset">
    <legend className="gm-google-access-fieldset__legend">Userinfo</legend>
    <p>{userinfo?.name}</p>
    <p>{userinfo?.email}</p>
  </fieldset>
);
