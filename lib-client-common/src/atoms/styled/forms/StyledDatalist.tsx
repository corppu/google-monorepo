import type { HTMLAttributes } from 'react';

import './StyledDatalist.css';

type StyledDatalistProps = Omit<HTMLAttributes<HTMLDataListElement>, 'style'>;

export const StyledDatalist = ({
  className,
  ...props
}: StyledDatalistProps) => (
  <datalist
    {...props}
    className={['styled-datalist', className].filter(Boolean).join(' ')}
  />
);
