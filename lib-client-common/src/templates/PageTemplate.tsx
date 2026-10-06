import type { ReactNode } from 'react';
import { Heading } from '../atoms/Heading';
import './PageTemplate.css';

export const PageTemplate = ({
  as: PageElement = 'main',
  children,
  title,
}: {
  as?: 'div' | 'main';
  children: ReactNode;
  title: string;
}) => (
  <PageElement className="gm-client-page-template">
    <Heading>{title}</Heading>
    {children}
  </PageElement>
);
