import type { HTMLAttributes } from 'react';
import './StyledSection.css';

export type StyledSectionProps = HTMLAttributes<HTMLElement> & {
  as?: 'article' | 'section' | 'main' | 'div';
  fullScreen?: boolean;
};

export const StyledSection = ({
  as = 'section',
  className,
  fullScreen,
  ...props
}: StyledSectionProps) => {
  const Component = as;

  const mergedClassName = [className, fullScreen ? 'fullscreen' : null]
    .filter(Boolean)
    .join(' ');

  return <Component {...props} className={mergedClassName} />;
};
