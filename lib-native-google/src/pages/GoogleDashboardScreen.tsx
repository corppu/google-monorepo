import { useMemo, useState } from 'react';
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
import { useTheme } from '@gm/lib-client-theme';

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
        section: {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.control,
          borderWidth: 1,
          gap: 8,
          padding: 12,
          paddingTop: 24,
          position: 'relative',
        },
        sectionInvalid: {
          borderColor: theme.colors.errorBorder,
        },
        sectionTitle: {
          backgroundColor: theme.colors.surface,
          color: theme.colors.ink,
          fontSize: 16,
          fontWeight: theme.typography.headingWeight,
          left: 8,
          paddingHorizontal: 4,
          position: 'absolute',
          top: -9,
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
            selectedKey={selectedGroupEmail || 'all-calendars'}
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
            selectedKey={selectedCalendarId}
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
              selectedKey={selectedEventId}
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
  <ThemedSection invalid={invalid} title={title}>
    {children}
  </ThemedSection>
);

const ThemedSection = ({
  children,
  invalid,
  title,
}: {
  children: React.ReactNode;
  invalid: boolean;
  title: string;
}) => {
  const styles = useDashboardStyles();

  return (
    <View style={[styles.section, invalid && styles.sectionInvalid]}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
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
