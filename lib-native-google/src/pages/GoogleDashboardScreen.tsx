import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type {
  CalendarList,
  Event,
  GoogleEventChanges,
  GooglePublicContactInfo,
  Group,
  Userinfo,
} from '@gm/lib-common-google';
import { CREATE_EVENT_OPTION_ID } from '@gm/lib-common-google';
import {
  Button,
  ChunkedList,
  Field,
  GenericForm,
  ScreenTemplate,
  SectionFieldset,
} from '@gm/lib-native-common';
import { useTheme } from '@gm/lib-client-theme';
import { GoogleEventInfo } from '../organisms/GoogleEventInfo';
import { GoogleGroupInfo } from '../organisms/GoogleGroupInfo';
import { GoogleUserinfoSectionFieldset } from '../organisms/GoogleUserinfoSectionFieldset';

export interface GoogleDashboardScreenProps {
  calendars?: CalendarList;
  contactInfo?: GooglePublicContactInfo;
  contactInfoError?: string;
  events?: Event[];
  fieldIdPrefix?: string;
  groups?: Group[];
  onCalendarSelect: (calendarId: string) => void;
  onEventSelect: (eventId: string) => void;
  onGroupSelect: (groupEmail: string) => void;
  onSaveEvent: (changes: GoogleEventChanges) => Promise<void>;
  selectedCalendarId: string;
  selectedEventId: string;
  selectedGroupEmail: string;
  userinfo?: Userinfo;
}

const useDashboardStyles = () => {
  const theme = useTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        choice: {
          alignItems: 'center',
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.borderSubtle,
          borderRadius: theme.radius.control,
          borderWidth: 1,
          flexDirection: 'row',
          gap: 8,
          minHeight: theme.sizes.control,
          paddingHorizontal: 8,
        },
        choiceLabel: {
          color: theme.colors.ink,
          flex: 1,
          fontSize: theme.typography.body,
        },
        choiceSelected: {
          backgroundColor: theme.colors.pressedSurface,
          borderColor: theme.colors.selected,
        },
        selectionIndicator: {
          alignItems: 'center',
          borderColor: theme.colors.border,
          borderRadius: 9,
          borderWidth: 1,
          height: theme.sizes.checkbox,
          justifyContent: 'center',
          width: theme.sizes.checkbox,
        },
        selectionIndicatorDot: {
          backgroundColor: theme.colors.selected,
          borderRadius: 5,
          height: 10,
          width: 10,
        },
        selectionIndicatorSelected: {
          borderColor: theme.colors.selected,
        },
      }),
    [theme],
  );
};

export const GoogleDashboardScreen = ({
  calendars,
  contactInfo,
  contactInfoError,
  events,
  fieldIdPrefix = 'event',
  groups,
  onCalendarSelect,
  onEventSelect,
  onGroupSelect,
  onSaveEvent,
  selectedCalendarId,
  selectedEventId,
  selectedGroupEmail,
  userinfo,
}: GoogleDashboardScreenProps) => {
  const creatingEvent = selectedEventId === CREATE_EVENT_OPTION_ID;
  const selectedEvent = events?.find((event) => event.id === selectedEventId);
  const selectedGroup = groups?.find(
    (group) => group.email === selectedGroupEmail,
  );
  const groupItems = [
    { email: '', id: 'all-calendars', label: 'All calendars' },
    ...(groups ?? [])
      .filter((group) => group.email)
      .map((group) => ({
        email: group.email!,
        id: group.id ?? group.email!,
        label: group.name ?? group.email!,
      })),
  ];
  const calendarItems =
    calendars?.items.filter((calendar) => calendar.id) ?? [];
  const eventItems = events?.filter((event) => event.id) ?? [];

  return (
    <ScreenTemplate title="Dashboard">
      <GenericForm
        style={{ alignSelf: 'center', gap: 16, maxWidth: 560, width: '100%' }}
      >
        <GoogleUserinfoSectionFieldset
          contactInfo={contactInfo}
          contactInfoError={contactInfoError}
          userinfo={userinfo}
        />
        <SectionFieldset legend="Google group">
          <ChunkedList
            accessibilityLabel="Google groups"
            getKey={(group) => group.id}
            items={groupItems}
            selectedKey={selectedGroupEmail || 'all-calendars'}
            renderItem={(group) => (
              <Choice
                label={group.label}
                selected={selectedGroupEmail === group.email}
                onPress={() => onGroupSelect(group.email)}
              />
            )}
          />
        </SectionFieldset>
        {selectedGroup && <GoogleGroupInfo group={selectedGroup} />}
        <SectionFieldset legend="Calendars">
          <ChunkedList
            accessibilityLabel="Calendars"
            getKey={(calendar) => calendar.id!}
            items={calendarItems}
            key={selectedGroupEmail}
            selectedKey={selectedCalendarId}
            renderItem={(calendar) => (
              <Choice
                label={calendar.summary ?? calendar.id!}
                selected={selectedCalendarId === calendar.id}
                onPress={() => onCalendarSelect(calendar.id!)}
              />
            )}
          />
        </SectionFieldset>
        {Boolean(selectedCalendarId) && (
          <SectionFieldset legend="Events">
            <Choice
              label="Create event"
              selected={selectedEventId === CREATE_EVENT_OPTION_ID}
              onPress={() => onEventSelect(CREATE_EVENT_OPTION_ID)}
            />
            <ChunkedList
              accessibilityLabel="Events"
              getKey={(event) => event.id!}
              items={eventItems}
              key={selectedCalendarId}
              selectedKey={selectedEventId}
              renderItem={(event) => (
                <Choice
                  label={event.summary?.trim() || event.id!}
                  selected={selectedEventId === event.id}
                  onPress={() => onEventSelect(event.id!)}
                />
              )}
            />
          </SectionFieldset>
        )}
        {selectedEvent && !creatingEvent && (
          <GoogleEventInfo event={selectedEvent} />
        )}
        {creatingEvent && (
          <GoogleEventEditorFieldset
            event={{}}
            idPrefix="create-event"
            mode="create"
            onSave={onSaveEvent}
          />
        )}
        {selectedEvent && !creatingEvent && (
          <GoogleEventEditorFieldset
            key={selectedEvent.id}
            event={selectedEvent}
            idPrefix={fieldIdPrefix}
            mode="update"
            onSave={onSaveEvent}
          />
        )}
      </GenericForm>
    </ScreenTemplate>
  );
};

const Choice = ({
  label,
  onPress,
  selected,
}: {
  label: string;
  onPress: () => void;
  selected: boolean;
}) => <ThemedChoice label={label} onPress={onPress} selected={selected} />;

const ThemedChoice = ({
  label,
  onPress,
  selected,
}: {
  label: string;
  onPress: () => void;
  selected: boolean;
}) => {
  const styles = useDashboardStyles();

  return (
    <Pressable
      aria-checked={selected}
      accessibilityLabel={label}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.choice, selected && styles.choiceSelected]}
    >
      <View
        style={[
          styles.selectionIndicator,
          selected && styles.selectionIndicatorSelected,
        ]}
      >
        {selected && <View style={styles.selectionIndicatorDot} />}
      </View>
      <Text style={styles.choiceLabel}>{label}</Text>
    </Pressable>
  );
};

const GoogleEventEditorFieldset = ({
  event,
  idPrefix,
  mode,
  onSave,
}: {
  event: Event;
  idPrefix: string;
  mode: 'create' | 'update';
  onSave: (changes: GoogleEventChanges) => Promise<void>;
}) => {
  const [summary, setSummary] = useState(event.summary ?? '');
  const [description, setDescription] = useState(event.description ?? '');
  const [message, setMessage] = useState('');
  const [titleError, setTitleError] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [dateError, setDateError] = useState('');

  const save = async () => {
    if (!summary.trim()) {
      setTitleError('Event title is required.');
      setMessage('');
      return;
    }
    if (mode === 'create') {
      const startTime = Date.parse(start);
      const endTime = Date.parse(end);
      if (
        Number.isNaN(startTime) ||
        Number.isNaN(endTime) ||
        endTime <= startTime
      ) {
        setDateError('Enter a valid start and end; end must be later.');
        return;
      }
      setDateError('');
    }

    setTitleError('');
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
    }
  };

  return (
    <SectionFieldset
      invalid={Boolean(titleError)}
      legend={mode === 'create' ? 'Create event' : 'Update event'}
    >
      <Field
        error={titleError || undefined}
        hint="Required field"
        nativeID={`${idPrefix}-summary-input`}
        label="Event title"
        onChangeText={(value) => {
          setSummary(value);
          if (value.trim()) setTitleError('');
        }}
        value={summary}
      />
      {mode === 'create' && (
        <>
          <Field
            error={dateError || undefined}
            hint="Required date and time"
            keyboardType="numbers-and-punctuation"
            nativeID={`${idPrefix}-start-input`}
            label="Start date and time"
            onChangeText={(value) => {
              setStart(value);
              setDateError('');
            }}
            placeholder="YYYY-MM-DDTHH:mm"
            value={start}
          />
          <Field
            error={dateError || undefined}
            hint="Required date and time"
            keyboardType="numbers-and-punctuation"
            nativeID={`${idPrefix}-end-input`}
            label="End date and time"
            onChangeText={(value) => {
              setEnd(value);
              setDateError('');
            }}
            placeholder="YYYY-MM-DDTHH:mm"
            value={end}
          />
        </>
      )}
      <Field
        hint="Optional"
        label="Description"
        multiline
        nativeID={`${idPrefix}-description-textarea`}
        onChangeText={setDescription}
        style={{ minHeight: 80, textAlignVertical: 'top' }}
        value={description}
      />
      <Button
        onPress={save}
        title={mode === 'create' ? 'Create event' : 'Save changes'}
      />
      {message !== '' && (
        <Text accessibilityLiveRegion="polite">{message}</Text>
      )}
    </SectionFieldset>
  );
};
