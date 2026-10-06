import type { FormHTMLAttributes } from 'react';
import './GenericForm.css';

type GenericFormProps = Omit<FormHTMLAttributes<HTMLFormElement>, 'style'>;

export const GenericForm = ({ className, ...props }: GenericFormProps) => (
  <form
    {...props}
    className={['gm-client-form', className].filter(Boolean).join(' ')}
  />
);
