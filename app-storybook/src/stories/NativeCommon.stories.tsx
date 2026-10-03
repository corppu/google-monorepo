import { useState } from 'react';
import { Text, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Button,
  Field,
  GenericAuthArticleForm,
  GenericScopesSelectorFieldset,
  ScreenTemplate,
} from '@gm/lib-native-common';
import {
  COMMON_STORY_PARAMETERS,
  INITIAL_SELECTED_SCOPE_IDS,
  MOCK_SCOPES,
  MOCK_USER,
  STORY_FORM_CONFIG,
  toggleSelectedScope,
} from './common';

const meta = {
  parameters: COMMON_STORY_PARAMETERS,
  title: 'Common Libraries/Native',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const NativeControls = () => {
  const [pressCount, setPressCount] = useState(0);

  return (
    <View style={{ gap: 16, padding: 24 }}>
      <Text>Button pressed {pressCount} times</Text>
      <Text>Signed in as {MOCK_USER.displayName}</Text>
      <Field
        label={STORY_FORM_CONFIG.identifierLabel}
        placeholder={MOCK_USER.email}
      />
      <Button
        onPress={() => setPressCount((count) => count + 1)}
        title="Count press"
      />
    </View>
  );
};

const NativeScopeSelection = () => {
  const [selected, setSelected] = useState([...INITIAL_SELECTED_SCOPE_IDS]);

  return (
    <GenericScopesSelectorFieldset
      onToggle={(id) =>
        setSelected((current) => toggleSelectedScope(current, id))
      }
      scopes={MOCK_SCOPES}
      selected={selected}
    />
  );
};

export const Controls: Story = {
  render: () => (
    <ScreenTemplate title="Native controls">
      <NativeControls />
    </ScreenTemplate>
  ),
};

export const ScopeSelection: Story = {
  render: () => <NativeScopeSelection />,
};

export const Authentication: Story = {
  render: () => (
    <GenericAuthArticleForm
      identifierLabel={STORY_FORM_CONFIG.identifierLabel}
      onSubmit={() => undefined}
    />
  ),
};
