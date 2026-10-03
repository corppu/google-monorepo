import type { ButtonHTMLAttributes } from 'react';
import type { CSSProperties } from 'react';
import { theme } from '@gm/lib-client-theme';

const buttonStyle: CSSProperties = {
  backgroundColor: theme.colors.subtleSurface,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.control,
  boxSizing: 'border-box',
  color: theme.colors.ink,
  cursor: 'pointer',
  font: 'inherit',
  fontWeight: theme.typography.buttonWeight,
  minHeight: theme.sizes.control,
  padding: `${theme.spacing.buttonVertical}px ${theme.spacing.buttonHorizontal}px`,
};

export const Button = ({
  style,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props} style={{ ...buttonStyle, ...style }} />
);
