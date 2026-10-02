import type { Userinfo } from '@gm/lib-common-google';
import { GenericForm } from '@gm/lib-client-common';

export const GoogleUserinfoAccessForm = ({ userinfo }: { userinfo?: Userinfo }) => (
  <GenericForm>
    <h2>Userinfo</h2>
    <p>{userinfo?.name} {userinfo?.email}</p>
  </GenericForm>
);
