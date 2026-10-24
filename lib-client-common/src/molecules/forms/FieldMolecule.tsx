import type { ReactElement } from 'react';
import type { StyledInputProps } from '../../atoms/styled/forms/StyledInput';
import type { StyledSelectProps } from '../../atoms/styled/forms/StyledSelect';
import type { StyledTextAreaProps } from '../../atoms/styled/forms/StyledTextArea';
import { StyledField } from '../../atoms/styled/forms/StyledField';
import { StyledLabel } from '../../atoms/styled/forms/StyledLabel';
import { StyledParagraph } from '../../atoms/styled/StyledParagraph';

/**
 * Strict union of allowed atom controls.
 * This ensures FieldMolecule ONLY accepts valid form atoms.
 */
export type FieldControl =
  | ReactElement<StyledInputProps>
  | ReactElement<StyledSelectProps>
  | ReactElement<StyledTextAreaProps>;

type FieldMoleculeProps = {
  children: FieldControl; // strict atom-only control
  className?: string;
  descriptions?: string[];
  error?: string;
  id: string; // required for WCAG
  label?: string;
};

export const FieldMolecule = ({
  children,
  className,
  descriptions,
  error,
  id,
  label,
}: FieldMoleculeProps) => {
  const errorId = error ? `${id}-error` : undefined;
  const descriptionIds = descriptions
    ? descriptions
        .filter((it) => Boolean(it.trim()))
        .map((_, index) => `${id}-description-${index}`)
    : [];

  /**
   * Inject WCAG-required attributes into the atom control.
   */
  const control = {
    ...children,
    props: {
      ...children.props,
      'aria-describedby':
        [errorId, ...descriptionIds].filter(Boolean).join(' ') || undefined,
      'aria-invalid': Boolean(error),
      id,
    },
  };

  return (
    <StyledField className={className}>
      {label && <StyledLabel htmlFor={id}>{label}</StyledLabel>}

      {control}

      {error && (
        <StyledParagraph aria-live="polite" id={errorId} className="error">
          {error}
        </StyledParagraph>
      )}

      {descriptions &&
        descriptions
          .filter((it) => Boolean(it.trim()))
          .map((description, index) => (
            <StyledParagraph id={descriptionIds[index]}>
              {description}
            </StyledParagraph>
          ))}
    </StyledField>
  );
};
