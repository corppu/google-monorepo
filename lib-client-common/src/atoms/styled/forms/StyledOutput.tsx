import type { HTMLAttributes } from 'react';
import './StyledOutput.css';

type StyledOutputProps = Omit<HTMLAttributes<HTMLOutputElement>, 'style'>;

export const StyledOutput = ({ className, ...props }: StyledOutputProps) => (
  <output
    {...props}
    className={['styled-output', className].filter(Boolean).join(' ')}
  />
);
