import { useState } from 'react';
import type { Event, GoogleEventChanges } from '@gm/lib-common-google';
import { Button, Field, SectionFieldset } from '@gm/lib-client-common';
import './GoogleEventEditorFieldset.css';

const toLocalDateTime = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};

export const GoogleEventEditorFieldset = ({
  event,
  idPrefix = 'event',
  mode,
  onSave,
}: {
  event: Event;
  idPrefix?: string;
  mode: 'create' | 'update';
  onSave: (changes: GoogleEventChanges) => Promise<void>;
}) => {
  const [summary, setSummary] = useState(event.summary ?? '');
  const [description, setDescription] = useState(event.description ?? '');
  const [start, setStart] = useState(() =>
    toLocalDateTime(event.start?.dateTime),
  );
  const [end, setEnd] = useState(() => toLocalDateTime(event.end?.dateTime));
  const [message, setMessage] = useState('');
  const [titleError, setTitleError] = useState('');
  const [startError, setStartError] = useState('');
  const [endError, setEndError] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!summary.trim()) {
      setTitleError('Event title is required.');
      setMessage('');
      return;
    }
    if (mode === 'create') {
      const startTime = Date.parse(start);
      const endTime = Date.parse(end);
      const nextStartError = Number.isNaN(startTime)
        ? 'Start date and time is required.'
        : '';
      const nextEndError = Number.isNaN(endTime)
        ? 'End date and time is required.'
        : endTime <= startTime
          ? 'End date and time must be after the start.'
          : '';
      setStartError(nextStartError);
      setEndError(nextEndError);
      if (nextStartError || nextEndError) return;
    }

    setSaving(true);
    setTitleError('');
    setMessage('');
    try {
      await onSave({
        description,
        summary,
        ...(mode === 'create'
          ? {
              end: { dateTime: new Date(end).toISOString() },
              start: { dateTime: new Date(start).toISOString() },
            }
          : {}),
      });
      setMessage(mode === 'create' ? 'Event created.' : 'Event updated.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionFieldset
      id={`${idPrefix}-${mode}-fieldset`}
      invalid={Boolean(titleError)}
      legend={mode === 'create' ? 'Create event' : 'Update event'}
    >
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
      {mode === 'create' && (
        <>
          <Field
            error={startError || undefined}
            hint="Required field"
            id={`${idPrefix}-start-input`}
            label="Start date and time"
            onChange={(e) => {
              setStart(e.target.value);
              setStartError('');
            }}
            required
            type="datetime-local"
            value={start}
          />
          <Field
            error={endError || undefined}
            hint="Required field"
            id={`${idPrefix}-end-input`}
            label="End date and time"
            onChange={(e) => {
              setEnd(e.target.value);
              setEndError('');
            }}
            required
            type="datetime-local"
            value={end}
          />
        </>
      )}
      <Field
        className="gm-client-event-editor-description"
        hint="Optional"
        id={`${idPrefix}-description-textarea`}
        label="Description"
        multiline
        onChange={(e) => setDescription(e.target.value)}
        value={description}
      />
      <Button type="button" disabled={saving} onClick={save}>
        {saving
          ? 'Saving...'
          : mode === 'create'
            ? 'Create event'
            : 'Save changes'}
      </Button>
      {message && <p role="status">{message}</p>}
    </SectionFieldset>
  );
};
