import type { Group } from '@gm/lib-common-google';
import { GenericForm } from '@gm/lib-client-common';

export const GoogleGroupAccessForm = ({ groups }: { groups?: Group[] }) => (
  <GenericForm>
    <h2>Groups</h2>
    <ul>{groups?.map((g) => <li key={g.id}>{g.name}</li>)}</ul>
  </GenericForm>
);
