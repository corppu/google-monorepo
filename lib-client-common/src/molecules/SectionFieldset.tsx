import type { ReactNode } from 'react';
import './SectionFieldset.css';

export const SectionFieldset = ({
  as = 'fieldset',
  children,
  id,
  invalid = false,
  legend,
}: {
  as?: 'article' | 'fieldset';
  children: ReactNode;
  id?: string;
  invalid?: boolean;
  legend: string;
}) => {
  const className = [
    'gm-client-section-fieldset',
    as === 'article' && 'gm-client-section-fieldset--article',
    invalid && 'gm-client-section-fieldset--invalid',
  ]
    .filter(Boolean)
    .join(' ');

  return as === 'article' ? (
    <article className={className} id={id}>
      <h3 className="gm-client-section-fieldset__legend">{legend}</h3>
      {children}
    </article>
  ) : (
    <fieldset className={className} id={id}>
      <legend className="gm-client-section-fieldset__legend">{legend}</legend>
      {children}
    </fieldset>
  );
};
