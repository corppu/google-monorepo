import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type {
  CalendarList,
  Event,
  Group,
  Userinfo,
} from '@gm/lib-common-google';
import {
  Button,
  ChunkedList,
  Field,
  GenericForm,
  ScreenTemplate,
} from '@gm/lib-native-common';

type GoogleEventChanges = Pick<Event, 'description' | 'summary'>;

export interface GoogleDashboardScreenProps {
  calendars?: CalendarList;
  events?: Event[];
  fieldIdPrefix?: string;
  groups?: Group[];
  onCalendarSelect: (calendarId: string) => void;
  onEventSelect: (eventId: string) => void;
  onGroupSelect: (groupEmail: string) => void;
  onUpdateEvent: (changes: GoogleEventChanges) => Promise<void>;
  selectedCalendarId: string;
  selectedEventId: string;
  selectedGroupEmail: string;
  userinfo?: Userinfo;
}

const styles = StyleSheet.create({
  choice: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e2e8eb',
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 40,
    paddingHorizontal: 8,
  },
  choiceLabel: {
    color: '#20272c',
    flex: 1,
    fontSize: 14,
  },
  choiceSelected: {
    backgroundColor: '#e5f1f4',
    borderColor: '#236b7c',
  },
  section: {
    backgroundColor: '#ffffff',
    borderColor: '#9eafb8',
    borderRadius: 6,
    borderWidth: 1,
    gap: 8,
    padding: 12,
    paddingTop: 24,
    position: 'relative',
  },
  sectionInvalid: {
    borderColor: '#d92d20',
  },
  sectionTitle: {
    backgroundColor: '#ffffff',
    color: '#20272c',
    fontSize: 16,
    fontWeight: '600',
    left: 8,
    paddingHorizontal: 4,
    position: 'absolute',
    top: -9,
  },
  selectionIndicator: {
    alignItems: 'center',
    borderColor: '#9eafb8',
    borderRadius: 9,
    borderWidth: 1,
    height: 18,
    justifyContent: 'center',
    width: 18,
  },
  selectionIndicatorDot: {
    backgroundColor: '#356a79',
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  selectionIndicatorSelected: {
    borderColor: '#356a79',
  },
});

export const GoogleDashboardScreen = ({
  calendars,
  events,
  fieldIdPrefix = 'event',
  groups,
  onCalendarSelect,
  onEventSelect,
  onGroupSelect,
  onUpdateEvent,
  selectedCalendarId,
  selectedEventId,
  selectedGroupEmail,
  userinfo,
}: GoogleDashboardScreenProps) => {
  const selectedEvent = events?.find((event) => event.id === selectedEventId);
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
        <Section title="Userinfo">
          <Text>{userinfo?.name}</Text>
          <Text>{userinfo?.email}</Text>
        </Section>
        <Section title="Google group">
          <ChunkedList
            accessibilityLabel="Google groups"
            getKey={(group) => group.id}
            items={groupItems}
            renderItem={(group) => (
              <Choice
                label={group.label}
                selected={selectedGroupEmail === group.email}
                onPress={() => onGroupSelect(group.email)}
              />
            )}
          />
        </Section>
        <Section title="Calendars">
          <ChunkedList
            accessibilityLabel="Calendars"
            getKey={(calendar) => calendar.id!}
            items={calendarItems}
            key={selectedGroupEmail}
            renderItem={(calendar) => (
              <Choice
                label={calendar.summary ?? calendar.id!}
                selected={selectedCalendarId === calendar.id}
                onPress={() => onCalendarSelect(calendar.id!)}
              />
            )}
          />
        </Section>
        {selectedCalendarId && (
          <Section title="Events">
            <ChunkedList
              accessibilityLabel="Events"
              getKey={(event) => event.id!}
              items={eventItems}
              key={selectedCalendarId}
              renderItem={(event) => (
                <Choice
                  label={event.summary?.trim() || event.id!}
                  selected={selectedEventId === event.id}
                  onPress={() => onEventSelect(event.id!)}
                />
              )}
            />
          </Section>
        )}
        {selectedEvent && (
          <EventEditor
            key={selectedEvent.id}
            event={selectedEvent}
            idPrefix={fieldIdPrefix}
            onUpdate={onUpdateEvent}
          />
        )}
      </GenericForm>
    </ScreenTemplate>
  );
};

const Section = ({
  children,
  invalid = false,
  title,
}: {
  children: React.ReactNode;
  invalid?: boolean;
  title: string;
}) => (
  <View style={[styles.section, invalid && styles.sectionInvalid]}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const Choice = ({
  label,
  onPress,
  selected,
}: {
  label: string;
  onPress: () => void;
  selected: boolean;
}) => (
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

const EventEditor = ({
  event,
  idPrefix,
  onUpdate,
}: {
  event: Event;
  idPrefix: string;
  onUpdate: (changes: GoogleEventChanges) => Promise<void>;
}) => {
  const [summary, setSummary] = useState(event.summary ?? '');
  const [description, setDescription] = useState(event.description ?? '');
  const [message, setMessage] = useState('');
  const [titleError, setTitleError] = useState('');

  const save = async () => {
    if (!summary.trim()) {
      setTitleError('Event title is required.');
      setMessage('');
      return;
    }

    setTitleError('');
    try {
      await onUpdate({ description, summary });
      setMessage('Event updated.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Update failed.');
    }
  };

  return (
    <Section invalid={Boolean(titleError)} title="Update event">
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
      <Field
        hint="Optional"
        label="Description"
        multiline
        nativeID={`${idPrefix}-description-textarea`}
        onChangeText={setDescription}
        style={{ minHeight: 80, textAlignVertical: 'top' }}
        value={description}
      />
      <Button onPress={save} title="Save changes" />
      {message !== '' && (
        <Text accessibilityLiveRegion="polite">{message}</Text>
      )}
    </Section>
  );
};
