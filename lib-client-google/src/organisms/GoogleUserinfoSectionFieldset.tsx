import type { GooglePublicContactInfo, Userinfo } from '@gm/lib-common-google';
import { AddressInfo, SectionFieldset } from '@gm/lib-client-common';

const unique = (values: Array<string | null | undefined>) => [
  ...new Set(
    values
      .map((value) => value?.trim())
      .filter((value): value is string => Boolean(value)),
  ),
];

const safeUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:'
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
};

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

  return (
    <SectionFieldset as="article" legend="Userinfo">
      <p>{userinfo?.name}</p>
      {emails.map((email) => (
        <AddressInfo key={`email-${email}`}>
          <p>{email}</p>
        </AddressInfo>
      ))}
      {contactInfo?.phoneNumbers.map((phone) => (
        <AddressInfo key={`phone-${phone}`}>
          <p>{phone}</p>
        </AddressInfo>
      ))}
      {contactInfo?.imClients.map((client, index) => (
        <AddressInfo key={`im-client-${index}-${client}`}>
          <p>{client}</p>
        </AddressInfo>
      ))}
      {contactInfo?.sipAddresses.map((address, index) => (
        <AddressInfo key={`sip-address-${index}-${address}`}>
          <p>{address}</p>
        </AddressInfo>
      ))}
      {contactInfo?.addresses.map((address, index) => (
        <AddressInfo key={`address-${index}-${address}`}>
          <p>{address}</p>
        </AddressInfo>
      ))}
      {[...(contactInfo?.urls ?? []), ...(contactInfo?.calendarUrls ?? [])].map(
        (value, index) => {
          const href = safeUrl(value);
          return (
            <AddressInfo key={`url-${index}-${value}`}>
              <p>
                {href ? (
                  <a href={href} rel="noreferrer" target="_blank">
                    {value}
                  </a>
                ) : (
                  value
                )}
              </p>
            </AddressInfo>
          );
        },
      )}
      {contactInfoError && <p role="alert">{contactInfoError}</p>}
    </SectionFieldset>
  );
};
