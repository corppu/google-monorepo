import type { InputHTMLAttributes } from 'react';
import { Input } from '../atoms/Input';

export const Field = ({ label, ...input }: { label: string } & InputHTMLAttributes<HTMLInputElement>) => (
  <label style={{ display: 'block' }}>
    {label} <Input {...input} />
  </label>
);
