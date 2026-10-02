import type { ReactNode } from 'react';
import { Heading } from '../atoms/Heading';

export const PageTemplate = ({ title, children }: { title: string; children: ReactNode }) => (
  <main>
    <Heading>{title}</Heading>
    {children}
  </main>
);
