import type { ReactNode } from 'react';
import './Heading.css';

export const Heading = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <h1 className={['gm-client-heading', className].filter(Boolean).join(' ')}>
    {children}
  </h1>
);
