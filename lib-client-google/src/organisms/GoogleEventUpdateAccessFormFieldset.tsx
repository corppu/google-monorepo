import { useState } from 'react';
import type { Event } from '@gm/lib-common-google';
import { Button, Input } from '@gm/lib-client-common';

type EventChanges = Pick<Event, 'description' | 'summary'>;

export const GoogleEventUpdateAccessFormFieldset = ({
  event,
  onUpdate,
}: {
  event: Event;
  onUpdate: (changes: EventChanges) => Promise<void>;
}) => {
  const [summary, setSummary] = useState(event.summary ?? '');
  const [description, setDescription] = useState(event.description ?? '');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    setMessage('');
    try {
      await onUpdate({ description, summary });
      setMessage('Event updated.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <fieldset>
      <legend>Update event</legend>
      <label>
        Event title
        <Input value={summary} onChange={(e) => setSummary(e.target.value)} />
      </label>
      <label>
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <Button type="button" disabled={saving} onClick={save}>
        {saving ? 'Saving...' : 'Save changes'}
      </Button>
      {message && <p role="status">{message}</p>}
    </fieldset>
  );
};
