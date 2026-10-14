import {
  AddressInfo,
  Paragraph,
  SectionFieldset,
  TextLink,
} from '@gm/lib-native-common';
import type { GooglePublicContactInfo, Userinfo } from '@gm/lib-common-google';

const unique = (values: Array<string | null | undefined>) => [
  ...new Set(
    values
      .map((value) => value?.trim())
      .filter((value): value is string => Boolean(value)),
  ),
];

const safeUrl = (value: string) =>
  /^https?:\/\/\S+$/i.test(value) ? value : undefined;

export const GoogleUserinfoSectionFieldset = ({
  contactInfo,
  contactInfoError,
  userinfo,
}: {
  contactInfo?: GooglePublicContactInfo;
  contactInfoError?: string;
  userinfo?: Userinfo;
}) => {
  const emails = unique([
    userinfo?.email,
    ...(contactInfo?.emailAddresses ?? []),
  ]);
  const plainValues = [
    ...(contactInfo?.phoneNumbers ?? []),
    ...(contactInfo?.imClients ?? []),
    ...(contactInfo?.sipAddresses ?? []),
    ...(contactInfo?.addresses ?? []),
  ];

  return (
    <SectionFieldset as="article" legend="Userinfo">
      <Paragraph>{userinfo?.name}</Paragraph>
      {emails.map((email) => (
        <AddressInfo key={`email-${email}`}>
          <Paragraph>{email}</Paragraph>
        </AddressInfo>
      ))}
      {plainValues.map((value, index) => (
        <AddressInfo key={`value-${index}-${value}`}>
          <Paragraph>{value}</Paragraph>
        </AddressInfo>
      ))}
      {[...(contactInfo?.urls ?? []), ...(contactInfo?.calendarUrls ?? [])].map(
        (value, index) => {
          const href = safeUrl(value);
          return (
            <AddressInfo key={`url-${index}-${value}`}>
              <Paragraph>
                {href ? <TextLink href={href}>{value}</TextLink> : value}
              </Paragraph>
            </AddressInfo>
          );
        },
      )}
      {Boolean(contactInfoError) && (
        <Paragraph accessibilityRole="alert">{contactInfoError}</Paragraph>
      )}
    </SectionFieldset>
  );
};
