import type { ReactNode } from 'react';
import './FeedItem.css';

const LocationLink = ({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) => (
  <a href={href} rel="noreferrer" target="_blank">
    {children}
  </a>
);

export const FeedItem = ({
  dateTimeEndLocalized,
  dateTimeISO,
  dateTimeLocalized,
  description,
  locationHref,
  locationText,
  title,
}: {
  dateTimeEndLocalized?: string;
  dateTimeISO?: string;
  dateTimeLocalized?: string;
  description?: ReactNode;
  locationHref?: string;
  locationText?: ReactNode;
  title: ReactNode;
}) => (
  <article className="gm-client-feed-item">
    <h4>
      <time dateTime={dateTimeISO}>{dateTimeLocalized}</time>
      <br />
      {title}
    </h4>
    {description}
    <br />
    {locationHref ? (
      <LocationLink href={locationHref}>{locationText}</LocationLink>
    ) : (
      locationText
    )}
    <br />
    {dateTimeLocalized}
    <br />
    {dateTimeEndLocalized}
  </article>
);
