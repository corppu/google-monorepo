import type { ButtonHTMLAttributes } from 'react';
import './StyledButton.css';

type StyledButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'>;

export const StyledButton = ({ className, ...props }: StyledButtonProps) => (
  <button
    {...props}
    className={['styled-button', className].filter(Boolean).join(' ')}
  />
);
