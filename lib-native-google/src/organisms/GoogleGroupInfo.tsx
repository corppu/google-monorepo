import { Fragment } from 'react';
import type { Group } from '@gm/lib-common-google';
import { Paragraph, SectionFieldset, TextLink } from '@gm/lib-native-common';

const ENTITIES: Record<string, string> = {
  '&#39;': "'",
  '&amp;': '&',
  '&gt;': '>',
  '&lt;': '<',
  '&nbsp;': ' ',
  '&quot;': '"',
};

const decode = (value: string) =>
  value.replace(/&(?:amp|gt|lt|nbsp|quot|#39);/g, (entity) => ENTITIES[entity]);

const stripTags = (value: string) => decode(value.replace(/<[^>]*>/g, ''));

const ANCHOR = /<a\s[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;

type Part = { href?: string; text: string };

const parseLine = (line: string): Part[] => {
  const parts: Part[] = [];
  let last = 0;
  for (const match of line.matchAll(ANCHOR)) {
    parts.push({ text: stripTags(line.slice(last, match.index)) });
    const href = decode(match[1]);
    parts.push(
      /^(https?:|mailto:|tel:)/i.test(href)
        ? { href, text: stripTags(match[2]) }
        : { text: stripTags(match[2]) },
    );
    last = match.index + match[0].length;
  }
  parts.push({ text: stripTags(line.slice(last)) });
  return parts.filter((part) => part.text.trim());
};

const descriptionLines = (description: string) =>
  description
    .replace(/<\/?(?:p|address|div|ul|ol|li)\b[^>]*>|<br\s*\/?>/gi, '\n')
    .split('\n')
    .map(parseLine)
    .filter((parts) => parts.length > 0);

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
      <Paragraph>{group.name}</Paragraph>
      <Paragraph>{group.email}</Paragraph>
      {emailAliases.map((alias) => (
        <Paragraph key={alias}>{alias}</Paragraph>
      ))}
      {!!group.description &&
        descriptionLines(group.description).map((parts, index) => (
          <Paragraph key={index}>
            {parts.map((part, partIndex) => (
              <Fragment key={partIndex}>
                {part.href ? (
                  <TextLink href={part.href}>{part.text}</TextLink>
                ) : (
                  part.text
                )}
              </Fragment>
            ))}
          </Paragraph>
        ))}
    </SectionFieldset>
  );
};
