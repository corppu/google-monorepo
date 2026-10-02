import type { Userinfo } from '@gm/lib-common-google';
import { Form } from '@gm/lib-client-common';

export const GenericUserinfoAccessForm = ({ userinfo }: { userinfo?: Userinfo }) => (
  <Form>
    <h2>Userinfo</h2>
    <p>{userinfo?.name} {userinfo?.email}</p>
  </Form>
);
