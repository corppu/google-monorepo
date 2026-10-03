import type { InputHTMLAttributes } from 'react';
import type { CSSProperties } from 'react';
import { theme } from '@gm/lib-client-theme';
import { Input } from '../atoms/Input';

const fieldStyle: CSSProperties = {
  color: theme.colors.ink,
  display: 'flex',
  flexDirection: 'column',
  fontSize: theme.typography.label,
  fontWeight: theme.typography.labelWeight,
  gap: theme.spacing.field,
};

export const Field = ({
  label,
  ...input
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) => (
  <label style={fieldStyle}>
    <span>{label}</span>
    <Input {...input} />
  </label>
);
