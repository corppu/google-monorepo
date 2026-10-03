import { useState } from 'react';
import { Text, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-vite';
import './CommonComparison.css';
import {
  Button as ClientButton,
  Field as ClientField,
  GenericScopeArticle as ClientScopeArticle,
  Heading,
  Input as ClientInput,
} from '@gm/lib-client-common';
import {
  Button as NativeButton,
  Field as NativeField,
  GenericScopeArticle as NativeScopeArticle,
  Input as NativeInput,
} from '@gm/lib-native-common';
import {
  COMMON_STORY_PARAMETERS,
  INITIAL_SELECTED_SCOPE_IDS,
  MOCK_SCOPES,
  MOCK_USER,
  toggleSelectedScope,
} from './common';

const meta = {
  parameters: { ...COMMON_STORY_PARAMETERS, layout: 'fullscreen' },
  title: 'Common Libraries/Comparison',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const optionalScope = MOCK_SCOPES[0];
const requiredScope = MOCK_SCOPES[1];

const ClientComponents = () => {
  const [pressCount, setPressCount] = useState(0);
  const [selected, setSelected] = useState([...INITIAL_SELECTED_SCOPE_IDS]);

  return (
    <section className="comparison-panel">
      <div className="comparison-panel-heading">
        <Heading>Client library</Heading>
      </div>
      <div className="comparison-section">
        <p className="comparison-section-label">Atom: Button</p>
        <ClientButton onClick={() => setPressCount((count) => count + 1)}>
          Pressed {pressCount} times
        </ClientButton>
      </div>
      <div className="comparison-section">
        <p className="comparison-section-label">Atom: Input</p>
        <ClientInput
          aria-label="Email address"
          defaultValue={MOCK_USER.email}
        />
      </div>
      <div className="comparison-section">
        <p className="comparison-section-label">Molecule: Field</p>
        <ClientField label="Email address" defaultValue={MOCK_USER.email} />
      </div>
      <div className="comparison-section">
        <p className="comparison-section-label">
          Molecule: GenericScopeArticle
        </p>
        <ClientScopeArticle
          checked={selected.includes(optionalScope.id)}
          onToggle={(id) =>
            setSelected((current) => toggleSelectedScope(current, id))
          }
          scope={optionalScope}
        />
        <ClientScopeArticle
          checked={selected.includes(requiredScope.id)}
          onToggle={(id) =>
            setSelected((current) => toggleSelectedScope(current, id))
          }
          scope={requiredScope}
        />
      </div>
    </section>
  );
};

const NativeComponents = () => {
  const [pressCount, setPressCount] = useState(0);
  const [selected, setSelected] = useState([...INITIAL_SELECTED_SCOPE_IDS]);

  return (
    <View nativeID="comparison-native-panel">
      <Text nativeID="comparison-native-title">Native library</Text>
      <View nativeID="comparison-native-button-section">
        <Text nativeID="comparison-native-section-label">Atom: Button</Text>
        <NativeButton
          onPress={() => setPressCount((count) => count + 1)}
          title={`Pressed ${pressCount} times`}
        />
      </View>
      <View nativeID="comparison-native-input-section">
        <Text nativeID="comparison-native-section-label">Atom: Input</Text>
        <NativeInput
          accessibilityLabel="Email address"
          defaultValue={MOCK_USER.email}
        />
      </View>
      <View nativeID="comparison-native-field-section">
        <Text nativeID="comparison-native-section-label">Molecule: Field</Text>
        <NativeField label="Email address" defaultValue={MOCK_USER.email} />
      </View>
      <View nativeID="comparison-native-scope-section">
        <Text nativeID="comparison-native-section-label">
          Molecule: GenericScopeArticle
        </Text>
        <NativeScopeArticle
          checked={selected.includes(optionalScope.id)}
          onToggle={(id) =>
            setSelected((current) => toggleSelectedScope(current, id))
          }
          scope={optionalScope}
        />
        <NativeScopeArticle
          checked={selected.includes(requiredScope.id)}
          onToggle={(id) =>
            setSelected((current) => toggleSelectedScope(current, id))
          }
          scope={requiredScope}
        />
      </View>
    </View>
  );
};

export const AtomsAndMolecules: Story = {
  render: () => (
    <main className="comparison-page">
      <header className="comparison-header">
        <h1>Client and native component comparison</h1>
        <p>Both libraries use the same mock account and scope selections.</p>
      </header>
      <div className="comparison-grid">
        <ClientComponents />
        <NativeComponents />
      </div>
    </main>
  ),
};
