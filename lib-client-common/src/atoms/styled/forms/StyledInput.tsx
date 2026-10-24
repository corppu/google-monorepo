import type { FC, InputHTMLAttributes, ReactElement } from 'react';
import './StyledInput.css';

export type StyledInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'style'
>;

export const StyledInput: FC<StyledInputProps> = ({
  className,
  ...props
}: StyledInputProps): ReactElement<StyledInputProps> => (
  <input
    {...props}
    className={['styled-input', className].filter(Boolean).join(' ')}
  />
);
