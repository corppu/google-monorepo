import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import './ClientCommon.stories.css';
import {
  Button,
  Field,
  GenericAuthArticleForm,
  GenericForm,
  GenericScopesSelectorFieldset,
  Heading,
  Input,
  PageTemplate,
} from '@gm/lib-client-common';
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
  title: 'Common Libraries/Client',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const ClientScopeSelection = () => {
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
    <PageTemplate title="Client controls">
      <GenericForm
        className="client-controls-form"
        onSubmit={(event) => event.preventDefault()}
      >
        <Heading>Account details</Heading>
        <Field label="Display name" placeholder={MOCK_USER.displayName} />
        <Input
          aria-label={STORY_FORM_CONFIG.identifierLabel}
          placeholder={MOCK_USER.email}
        />
        <Button type="submit">Save details</Button>
      </GenericForm>
    </PageTemplate>
  ),
};

export const ScopeSelection: Story = {
  render: () => <ClientScopeSelection />,
};

export const Authentication: Story = {
  render: () => (
    <GenericAuthArticleForm
      onSubmit={() => undefined}
      identifierLabel={STORY_FORM_CONFIG.identifierLabel}
      identifierName={STORY_FORM_CONFIG.identifierName}
    />
  ),
};
