import type { InputHTMLAttributes } from 'react';
import './Input.css';

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'style'>;

export const Input = ({ className, ...props }: InputProps) => (
  <input
    {...props}
    className={['gm-client-input', className].filter(Boolean).join(' ')}
  />
);
