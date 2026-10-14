import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Group } from '@gm/lib-common-google';
import { GoogleGroupInfo } from '@gm/lib-client-google';
import { COMMON_STORY_PARAMETERS } from './common';

const MOCK_GROUP: Group = {
  aliases: ['product@example.com', 'products@example.com'],
  description:
    'Builds tools that make planning easier for everyone.<p>Visit our office:</p><address>123 Example Street<br>Example City, CA 90000</address><a href="https://maps.google.com/?q=123+Example+Street">View on Google Maps</a>',
  email: 'product-team@example.com',
  id: 'product-team',
  name: 'Product team',
  nonEditableAliases: ['products@another-example.com'],
};

const meta = {
  parameters: COMMON_STORY_PARAMETERS,
  title: 'Google Groups/Group Info',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const GroupInfo: Story = {
  render: () => <GoogleGroupInfo group={MOCK_GROUP} />,
};
