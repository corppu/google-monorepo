import type { LabelHTMLAttributes } from 'react';

import './StyledLabel.css';

type StyledLabelProps = Omit<LabelHTMLAttributes<HTMLLabelElement>, 'style'>;

export const StyledLabel = ({ className, ...props }: StyledLabelProps) => (
  <label
    {...props}
    className={['styled-label', className].filter(Boolean).join(' ')}
  />
);
