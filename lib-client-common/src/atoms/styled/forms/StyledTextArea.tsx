import type { FC, ReactElement, TextareaHTMLAttributes } from 'react';

import './StyledTextArea.css';

export type StyledTextAreaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'style'
>;

export const StyledTextArea: FC<StyledTextAreaProps> = ({
  className,
  ...props
}: StyledTextAreaProps): ReactElement<StyledTextAreaProps> => (
  <textarea
    {...props}
    className={['styled-textarea', className].filter(Boolean).join(' ')}
  />
);
