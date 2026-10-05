import type { ReactNode } from 'react';
import './SectionFieldset.css';

export const SectionFieldset = ({
  children,
  id,
  invalid = false,
  legend,
}: {
  children: ReactNode;
  id?: string;
  invalid?: boolean;
  legend: string;
}) => (
  <fieldset
    className={`gm-client-section-fieldset${invalid ? ' gm-client-section-fieldset--invalid' : ''}`}
    id={id}
  >
    <legend className="gm-client-section-fieldset__legend">{legend}</legend>
    {children}
  </fieldset>
);
