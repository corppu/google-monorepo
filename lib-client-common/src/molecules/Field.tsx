import type { InputHTMLAttributes } from 'react';
import { Input } from '../atoms/Input';
import './Field.css';

type FieldProps = {
  className?: string;
  label: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'style'>;

export const Field = ({ className, label, ...input }: FieldProps) => (
  <label className={['gm-client-field', className].filter(Boolean).join(' ')}>
    <span className="gm-client-field__label">{label}</span>
    <Input {...input} />
  </label>
);
