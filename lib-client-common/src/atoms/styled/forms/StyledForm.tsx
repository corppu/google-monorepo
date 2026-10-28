import type { FormHTMLAttributes } from 'react';

import './StyledForm.css';

type StyledFormProps = Omit<FormHTMLAttributes<HTMLFormElement>, 'style'>;

export const StyledForm = ({ className, ...props }: StyledFormProps) => (
  <form
    {...props}
    className={['styled-form', className].filter(Boolean).join(' ')}
  />
);
