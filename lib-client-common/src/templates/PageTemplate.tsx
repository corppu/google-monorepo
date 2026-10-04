import type { ReactNode } from 'react';
import { Heading } from '../atoms/Heading';
import './PageTemplate.css';

export const PageTemplate = ({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) => (
  <main className="gm-client-page-template">
    <Heading>{title}</Heading>
    {children}
  </main>
);
