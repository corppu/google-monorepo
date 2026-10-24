import type { FC, ReactElement, SelectHTMLAttributes } from 'react';
import './StyledSelect.css';

export type StyledSelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'style'
>;

export const StyledSelect: FC<StyledSelectProps> = ({
  className,
  ...props
}: StyledSelectProps): ReactElement<StyledSelectProps> => (
  <select
    {...props}
    className={['styled-select', className].filter(Boolean).join(' ')}
  />
);
