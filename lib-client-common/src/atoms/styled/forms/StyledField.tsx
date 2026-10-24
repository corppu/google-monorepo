import type { HTMLAttributes } from 'react';
import './StyledField.css';

type StyledFieldProps = Omit<HTMLAttributes<HTMLDivElement>, 'style'>;

export const StyledField = ({ className, ...props }: StyledFieldProps) => (
  <div
    {...props}
    className={['styled-field', className].filter(Boolean).join(' ')}
  />
);
