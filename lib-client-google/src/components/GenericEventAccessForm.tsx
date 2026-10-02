import type { Event } from '@gm/lib-common-google';
import { Form } from '@gm/lib-client-common';

export const GenericEventAccessForm = ({ events }: { events?: Event[] }) => (
  <Form>
    <h2>Events</h2>
    <ul>{events?.map((e) => <li key={e.id}>{e.summary}</li>)}</ul>
  </Form>
);
