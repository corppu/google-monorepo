import type { HTMLAttributes, DetailedHTMLProps } from 'react';

import './StyledHeading.css';

type StyledHeadingProps = Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>,
  'style'
> & {
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
};

export const StyledHeading = ({
  as,
  children,
  className,
  ...props
}: StyledHeadingProps) => {
  const Tag = as; // h1 | h2 | h3 | h4 | h5

  return (
    <Tag
      className={['styled-heading', className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </Tag>
  );
};
