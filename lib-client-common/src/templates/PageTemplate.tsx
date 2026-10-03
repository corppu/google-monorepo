import type { ReactNode } from 'react';
import { Heading } from '../atoms/Heading';

export const PageTemplate = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => (
  <main>
    <Heading>{title}</Heading>
    {children}
  </main>
);
