import type { FieldsetHTMLAttributes } from 'react';
import './StyledForm.css';

type StyledFormProps = Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  'style'
>;

export const StyledForm = ({ className, ...props }: StyledFormProps) => (
  <fieldset
    {...props}
    className={['styled-fieldset', className].filter(Boolean).join(' ')}
  />
);
