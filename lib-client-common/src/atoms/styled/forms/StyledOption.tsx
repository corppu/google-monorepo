import type { OptionHTMLAttributes } from 'react';
import './StyledOption.css';

type StyledOptionProps = Omit<OptionHTMLAttributes<HTMLOptionElement>, 'style'>;

export const StyledOption = ({ className, ...props }: StyledOptionProps) => (
  <option
    {...props}
    className={['styled-option', className].filter(Boolean).join(' ')}
  />
);
