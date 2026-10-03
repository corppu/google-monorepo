import type { CSSProperties, ReactNode } from 'react';
import { theme } from '@gm/lib-client-theme';

const headingStyle: CSSProperties = {
  color: theme.colors.ink,
  fontSize: theme.typography.heading,
  fontWeight: theme.typography.headingWeight,
  lineHeight: theme.typography.headingLineHeight,
  margin: 0,
};

export const Heading = ({ children }: { children: ReactNode }) => (
  <h1 style={headingStyle}>{children}</h1>
);
