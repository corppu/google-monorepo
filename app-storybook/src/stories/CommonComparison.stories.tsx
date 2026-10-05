import { useState } from 'react';
import { Text, View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-vite';
import './CommonComparison.css';
import {
  AddressInfo as ClientAddressInfo,
  Button as ClientButton,
  ChunkedList as ClientChunkedList,
  FeedItem as ClientFeedItem,
  Field as ClientField,
  GenericScopeArticle as ClientScopeArticle,
  Heading,
  Input as ClientInput,
  Paragraph as ClientParagraph,
  SectionFieldset as ClientSectionFieldset,
  TextLink as ClientTextLink,
} from '@gm/lib-client-common';
import {
  AddressInfo as NativeAddressInfo,
  Button as NativeButton,
  ChunkedList as NativeChunkedList,
  FeedItem as NativeFeedItem,
  Field as NativeField,
  GenericScopeArticle as NativeScopeArticle,
  Heading as NativeHeading,
  Input as NativeInput,
  Paragraph as NativeParagraph,
  SectionFieldset as NativeSectionFieldset,
  TextLink as NativeTextLink,
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

const LIST_ITEMS = ['Product planning', 'Release calendar', 'Operations'];
const FEED_ITEM = {
  dateTimeEndLocalized: 'Oct 5, 2026, 11:00 AM',
  dateTimeISO: '2026-10-05T10:00:00Z',
  dateTimeLocalized: 'Oct 5, 2026, 10:00 AM',
  locationHref: 'https://maps.google.com/?q=Helsinki',
  locationText: 'Helsinki office',
  title: 'Roadmap review',
};

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
      <div className="comparison-section">
        <p className="comparison-section-label">Atom: Heading</p>
        <Heading>Heading text</Heading>
      </div>
      <div className="comparison-section">
        <p className="comparison-section-label">Atom: Paragraph and TextLink</p>
        <ClientParagraph>Paragraph text</ClientParagraph>
        <ClientTextLink href="https://example.com">Link text</ClientTextLink>
      </div>
      <div className="comparison-section">
        <p className="comparison-section-label">Molecule: ChunkedList</p>
        <ClientChunkedList
          ariaLabel="Items"
          getKey={(item) => item}
          items={LIST_ITEMS}
          renderItem={(item) => <ClientParagraph>{item}</ClientParagraph>}
        />
      </div>
      <div className="comparison-section">
        <p className="comparison-section-label">
          Molecule: SectionFieldset (fieldset)
        </p>
        <ClientSectionFieldset legend="Fieldset legend">
          <ClientParagraph>Fieldset content</ClientParagraph>
        </ClientSectionFieldset>
      </div>
      <div className="comparison-section">
        <p className="comparison-section-label">
          Molecule: SectionFieldset (article)
        </p>
        <ClientSectionFieldset as="article" legend="Article legend">
          <ClientParagraph>Article content</ClientParagraph>
        </ClientSectionFieldset>
      </div>
      <div className="comparison-section">
        <p className="comparison-section-label">Molecule: AddressInfo</p>
        <ClientAddressInfo>
          <ClientParagraph>Morgan Lee</ClientParagraph>
          <ClientParagraph>morgan.lee@example.com</ClientParagraph>
        </ClientAddressInfo>
      </div>
      <div className="comparison-section">
        <p className="comparison-section-label">Molecule: FeedItem</p>
        <ClientFeedItem
          {...FEED_ITEM}
          description="Review the next milestone."
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
      <View nativeID="comparison-native-heading-section">
        <Text nativeID="comparison-native-section-label">Atom: Heading</Text>
        <NativeHeading>Heading text</NativeHeading>
      </View>
      <View nativeID="comparison-native-paragraph-section">
        <Text nativeID="comparison-native-section-label">
          Atom: Paragraph and TextLink
        </Text>
        <NativeParagraph>Paragraph text</NativeParagraph>
        <NativeTextLink href="https://example.com">Link text</NativeTextLink>
      </View>
      <View nativeID="comparison-native-list-section">
        <Text nativeID="comparison-native-section-label">
          Molecule: ChunkedList
        </Text>
        <NativeChunkedList
          accessibilityLabel="Items"
          getKey={(item) => item}
          items={LIST_ITEMS}
          renderItem={(item) => <NativeParagraph>{item}</NativeParagraph>}
        />
      </View>
      <View nativeID="comparison-native-fieldset-section">
        <Text nativeID="comparison-native-section-label">
          Molecule: SectionFieldset (fieldset)
        </Text>
        <NativeSectionFieldset legend="Fieldset legend">
          <NativeParagraph>Fieldset content</NativeParagraph>
        </NativeSectionFieldset>
      </View>
      <View nativeID="comparison-native-article-section">
        <Text nativeID="comparison-native-section-label">
          Molecule: SectionFieldset (article)
        </Text>
        <NativeSectionFieldset as="article" legend="Article legend">
          <NativeParagraph>Article content</NativeParagraph>
        </NativeSectionFieldset>
      </View>
      <View nativeID="comparison-native-address-section">
        <Text nativeID="comparison-native-section-label">
          Molecule: AddressInfo
        </Text>
        <NativeAddressInfo>
          <NativeParagraph>Morgan Lee</NativeParagraph>
          <NativeParagraph>morgan.lee@example.com</NativeParagraph>
        </NativeAddressInfo>
      </View>
      <View nativeID="comparison-native-feed-section">
        <Text nativeID="comparison-native-section-label">
          Molecule: FeedItem
        </Text>
        <NativeFeedItem
          {...FEED_ITEM}
          description="Review the next milestone."
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
