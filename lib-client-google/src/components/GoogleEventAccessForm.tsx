import type { Event } from '@gm/lib-common-google';
import { GenericForm } from '@gm/lib-client-common';

export const GoogleEventAccessForm = ({ events }: { events?: Event[] }) => (
  <GenericForm>
    <h2>Events</h2>
    <ul>{events?.map((e) => <li key={e.id}>{e.summary}</li>)}</ul>
  </GenericForm>
);
