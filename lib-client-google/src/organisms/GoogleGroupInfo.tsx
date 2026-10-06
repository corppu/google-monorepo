import type { Group } from '@gm/lib-common-google';
import { SectionFieldset } from '@gm/lib-client-common';
import sanitizeHtml from 'sanitize-html';
import './GoogleGroupInfo.css';

const sanitizeGroupDescription = (description: string) =>
  sanitizeHtml(description, {
    allowedAttributes: { a: ['href'] },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedTags: ['a', 'address', 'br', 'em', 'li', 'ol', 'p', 'strong', 'ul'],
    transformTags: {
      a: sanitizeHtml.simpleTransform(
        'a',
        { rel: 'noopener noreferrer', target: '_blank' },
        true,
      ),
    },
  });

export const GoogleGroupInfo = ({ group }: { group: Group }) => {
  const emailAliases = [
    ...new Set(
      [...(group.aliases ?? []), ...(group.nonEditableAliases ?? [])].filter(
        (alias) => alias !== group.email,
      ),
    ),
  ];

  return (
    <SectionFieldset as="article" legend="Group info">
      <p>{group.name}</p>
      <p>{group.email}</p>
      {emailAliases.map((alias) => (
        <p key={alias}>{alias}</p>
      ))}
      {group.description && (
        <div
          className="gm-google-group-info__description"
          dangerouslySetInnerHTML={{
            __html: sanitizeGroupDescription(group.description),
          }}
        />
      )}
    </SectionFieldset>
  );
};
