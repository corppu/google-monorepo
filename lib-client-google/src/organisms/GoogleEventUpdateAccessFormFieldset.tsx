import { useState } from 'react';
import type { Event } from '@gm/lib-common-google';
import { Button, Field } from '@gm/lib-client-common';
import './GoogleAccessFormFieldset.css';
import './GoogleEventUpdateAccessFormFieldset.css';

type EventChanges = Pick<Event, 'description' | 'summary'>;

export const GoogleEventUpdateAccessFormFieldset = ({
  event,
  idPrefix = 'event',
  onUpdate,
}: {
  event: Event;
  idPrefix?: string;
  onUpdate: (changes: EventChanges) => Promise<void>;
}) => {
  const [summary, setSummary] = useState(event.summary ?? '');
  const [description, setDescription] = useState(event.description ?? '');
  const [message, setMessage] = useState('');
  const [titleError, setTitleError] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!summary.trim()) {
      setTitleError('Event title is required.');
      setMessage('');
      return;
    }

    setSaving(true);
    setTitleError('');
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
    <fieldset
      className={`gm-google-access-fieldset ${titleError ? 'gm-client-event-update-fieldset--invalid' : ''}`.trim()}
    >
      <legend className="gm-google-access-fieldset__legend">
        Update event
      </legend>
      <Field
        error={titleError || undefined}
        hint="Required field"
        id={`${idPrefix}-summary-input`}
        label="Event title"
        onChange={(e) => {
          setSummary(e.target.value);
          if (e.target.value.trim()) setTitleError('');
        }}
        required
        value={summary}
      />
      <Field
        className="gm-client-event-update-description"
        hint="Optional"
        id={`${idPrefix}-description-textarea`}
        label="Description"
        multiline
        onChange={(e) => setDescription(e.target.value)}
        value={description}
      />
      <Button type="button" disabled={saving} onClick={save}>
        {saving ? 'Saving...' : 'Save changes'}
      </Button>
      {message && <p role="status">{message}</p>}
    </fieldset>
  );
};
