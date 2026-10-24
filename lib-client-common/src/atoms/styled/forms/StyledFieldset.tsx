import type { FieldsetHTMLAttributes } from 'react';
import './StyledFieldset.css';

type StyledFieldsetProps = Omit<
  FieldsetHTMLAttributes<HTMLFieldSetElement>,
  'style'
> & { as?: 'fieldset' | 'article' | 'section' };

export const StyledFieldset = ({
  as = 'fieldset',
  className,
  ...props
}: StyledFieldsetProps) => {
  const Fieldset = as;
  return (
    <Fieldset
      {...props}
      className={['styled-fieldset', className].filter(Boolean).join(' ')}
    />
  );
};
