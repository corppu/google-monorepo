import type { ReactNode } from 'react';
import './VisuallyHiddenHeading.css';

export const VisuallyHiddenHeading = ({
  children,
  id,
}: {
  children: ReactNode;
  id: string;
}) => (
  <h2 id={id} className="visually-hidden">
    {children}
  </h2>
);
