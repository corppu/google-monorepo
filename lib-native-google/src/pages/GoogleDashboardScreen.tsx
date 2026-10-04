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
  Field,
  GenericForm,
  ScreenTemplate,
} from '@gm/lib-native-common';

type GoogleEventChanges = Pick<Event, 'description' | 'summary'>;

export interface GoogleDashboardScreenProps {
  calendars?: CalendarList;
  events?: Event[];
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
          <Choice
            label="All calendars"
            selected={!selectedGroupEmail}
            onPress={() => onGroupSelect('')}
          />
          {groups?.map((group) =>
            group.email ? (
              <Choice
                key={group.id ?? group.email}
                label={group.name ?? group.email}
                selected={selectedGroupEmail === group.email}
                onPress={() => onGroupSelect(group.email!)}
              />
            ) : null,
          )}
        </Section>
        <Section title="Calendars">
          {calendars?.items.map((calendar) =>
            calendar.id ? (
              <Choice
                key={calendar.id}
                label={calendar.summary ?? calendar.id}
                selected={selectedCalendarId === calendar.id}
                onPress={() => onCalendarSelect(calendar.id!)}
              />
            ) : null,
          )}
        </Section>
        {selectedCalendarId && (
          <Section title="Events">
            {events?.map((event) =>
              event.id ? (
                <Choice
                  key={event.id}
                  label={event.summary ?? event.id}
                  selected={selectedEventId === event.id}
                  onPress={() => onEventSelect(event.id!)}
                />
              ) : null,
            )}
          </Section>
        )}
        {selectedEvent && (
          <EventEditor
            key={selectedEvent.id}
            event={selectedEvent}
            onUpdate={onUpdateEvent}
          />
        )}
      </GenericForm>
    </ScreenTemplate>
  );
};

const Section = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => (
  <View style={styles.section}>
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
  onUpdate,
}: {
  event: Event;
  onUpdate: (changes: GoogleEventChanges) => Promise<void>;
}) => {
  const [summary, setSummary] = useState(event.summary ?? '');
  const [description, setDescription] = useState(event.description ?? '');
  const [message, setMessage] = useState('');

  const save = async () => {
    try {
      await onUpdate({ description, summary });
      setMessage('Event updated.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Update failed.');
    }
  };

  return (
    <Section title="Update event">
      <Field label="Event title" onChangeText={setSummary} value={summary} />
      <Field
        label="Description"
        multiline
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
