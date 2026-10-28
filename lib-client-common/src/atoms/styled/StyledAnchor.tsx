import type { AnchorHTMLAttributes } from 'react';

import './StyledAnchor.css';

type StyledAnchorProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'style'>;

export const StyledAnchor = ({
  children,
  className,
  ...props
}: StyledAnchorProps) => (
  <a
    className={['styled-anchor', className].filter(Boolean).join(' ')}
    {...props}
    rel="noreferrer"
    target="_blank"
  >
    {children}
  </a>
);
