import type { Group } from '@gm/lib-common-google';
import { Form } from '@gm/lib-client-common';

export const GenericGroupAccessForm = ({ groups }: { groups?: Group[] }) => (
  <Form>
    <h2>Groups</h2>
    <ul>{groups?.map((g) => <li key={g.id}>{g.name}</li>)}</ul>
  </Form>
);
