import { StyledInput } from '../../atoms/styled/forms/StyledInput';
import { StyledTextArea } from '../../atoms/styled/forms/StyledTextArea';
import { FieldMolecule } from '../../molecules/forms/FieldMolecule';

type TextFieldOrganismProps = {
  className?: string;
  descriptions?: string[];
  error?: string;
  id: string;

  label?: string;
  maxLength?: number;
  minLength?: number;

  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  type?: string;

  value?: string;
};

export const TextFieldOrganism = ({
  className,
  descriptions,
  error,
  id,
  label,
  maxLength,
  minLength,
  onChange,
  type = 'text',
  value = '',
}: TextFieldOrganismProps) => {
  const length = value?.length ?? 0;

  const shouldUseTextArea =
    type === 'textarea' ||
    (typeof maxLength === 'number' && maxLength >= 200) ||
    (typeof minLength === 'number' && minLength >= 50);

  // Remaining characters logic
  let counterState: 'warning' | 'error' | 'neutral' = 'neutral';
  let counterMessage = '';

  if (typeof minLength === 'number' && length < minLength) {
    const remaining = minLength - length;
    counterState = 'warning';
    counterMessage = `Need ${remaining} more characters`;
  } else if (typeof maxLength === 'number' && length > maxLength) {
    const over = length - maxLength;
    counterState = 'error';
    counterMessage = `Over by ${over} characters`;
  }

  const control = shouldUseTextArea ? (
    <StyledTextArea
      value={value}
      onChange={onChange}
      minLength={minLength}
      maxLength={maxLength}
    />
  ) : (
    <StyledInput
      type={type}
      value={value}
      onChange={onChange}
      minLength={minLength}
      maxLength={maxLength}
    />
  );

  return (
    <FieldMolecule
      id={id}
      label={label}
      descriptions={
        descriptions && counterMessage
          ? [counterMessage, ...descriptions]
          : descriptions || (counterMessage && [counterMessage]) || undefined
      }
      error={error}
      className={className}
    >
      {control}
    </FieldMolecule>
  );
};
