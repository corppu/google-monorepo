import type { InputHTMLAttributes } from 'react';
import type { CSSProperties } from 'react';
import { theme } from '@gm/lib-client-theme';

const inputStyle: CSSProperties = {
  backgroundColor: theme.colors.surface,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.control,
  boxSizing: 'border-box',
  color: theme.colors.ink,
  font: 'inherit',
  minHeight: theme.sizes.control,
  padding: `${theme.spacing.inputVertical}px ${theme.spacing.inputHorizontal}px`,
  width: '100%',
};

export const Input = ({
  style,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} style={{ ...inputStyle, ...style }} />
);
