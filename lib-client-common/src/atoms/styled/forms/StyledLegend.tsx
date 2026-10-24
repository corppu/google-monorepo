import type { HTMLAttributes } from 'react';
import './StyledLegend.css';

type StyledLegendProps = Omit<HTMLAttributes<HTMLLegendElement>, 'style'> & {
  as?: 'legend' | 'h2' | 'h3' | 'h4' | 'h5';
};

export const StyledLegend = ({
  as = 'legend',
  className,
  ...props
}: StyledLegendProps) => {
  const Legend = as;
  return (
    <Legend
      {...props}
      className={['styled-legend', className].filter(Boolean).join(' ')}
    />
  );
};
