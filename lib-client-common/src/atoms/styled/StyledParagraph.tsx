import type { HTMLAttributes } from 'react';

import './StyledParagraph.css';

type StyledParagraphProps = Omit<HTMLAttributes<HTMLParagraphElement>, 'style'>;

export const StyledParagraph = ({
  className,
  ...props
}: StyledParagraphProps) => (
  <p
    {...props}
    className={['styled-paragraph', className].filter(Boolean).join(' ')}
  />
);
