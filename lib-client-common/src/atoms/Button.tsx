import type { ButtonHTMLAttributes } from 'react';
import './Button.css';

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'>;

export const Button = ({ className, ...props }: ButtonProps) => (
  <button
    {...props}
    className={['gm-client-button', className].filter(Boolean).join(' ')}
  />
);
