import type { Meta, StoryObj } from '@storybook/react-vite';
import type { GooglePublicContactInfo } from '@gm/lib-common-google';
import { GoogleUserinfoSectionFieldset } from '@gm/lib-client-google';
import { COMMON_STORY_PARAMETERS } from './common';

const MOCK_PUBLIC_CONTACT_INFO: GooglePublicContactInfo = {
  addresses: ['123 Example Street, Example City, CA 90000, United States'],
  calendarUrls: ['https://calendar.google.com/calendar/u/0?cid=example'],
  emailAddresses: ['ada.lovelace@example.com'],
  imClients: ['ada.lovelace'],
  phoneNumbers: ['+1 555 010 2020'],
  sipAddresses: ['ada.lovelace@example.com'],
  urls: ['https://example.com/ada'],
};

const meta = {
  parameters: COMMON_STORY_PARAMETERS,
  title: 'Google Userinfo/Public Contact Info',
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const PublicContactAddresses: Story = {
  render: () => (
    <GoogleUserinfoSectionFieldset contactInfo={MOCK_PUBLIC_CONTACT_INFO} />
  ),
};
