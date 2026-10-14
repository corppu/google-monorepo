import type { ReactNode } from 'react';
import './Paragraph.css';

export const Paragraph = ({ children }: { children: ReactNode }) => (
  <p className="gm-client-paragraph">{children}</p>
);

export const TextLink = ({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) => (
  <a
    className="gm-client-text-link"
    href={href}
    rel="noreferrer"
    target="_blank"
  >
    {children}
  </a>
);
