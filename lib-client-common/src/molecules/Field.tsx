import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { Input } from '../atoms/Input';
import './Field.css';

type FieldBaseProps = {
  className?: string;
  error?: string;
  hint?: string;
  id?: string;
  label: string;
};

type InputFieldProps = FieldBaseProps &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'aria-describedby' | 'aria-invalid' | 'className' | 'id' | 'style'
  > & {
    multiline?: false;
  };

type MultilineFieldProps = FieldBaseProps &
  Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    'aria-describedby' | 'aria-invalid' | 'className' | 'id' | 'style'
  > & {
    multiline: true;
  };

export type FieldProps = InputFieldProps | MultilineFieldProps;

export const Field = (props: FieldProps) => {
  const generatedId = useId();
  const fieldId = props.id ?? generatedId;
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;
  const describedBy = [
    props.hint ? hintId : undefined,
    props.error ? errorId : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  if ('multiline' in props && props.multiline) {
    const { className, error, hint, label, multiline, ...textarea } = props;
    return (
      <div className={['gm-client-field', className].filter(Boolean).join(' ')}>
        <label className="gm-client-field__label" htmlFor={fieldId}>
          {label}
        </label>
        <textarea
          {...textarea}
          aria-describedby={describedBy || undefined}
          aria-invalid={Boolean(error)}
          className="gm-client-input gm-client-field__textarea"
          id={fieldId}
        />
        {hint && (
          <span className="gm-client-field__hint" id={hintId}>
            {hint}
          </span>
        )}
        {error && (
          <span className="gm-client-field__error" id={errorId} role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }

  const { className, error, hint, label, ...input } = props;
  return (
    <div className={['gm-client-field', className].filter(Boolean).join(' ')}>
      <label className="gm-client-field__label" htmlFor={fieldId}>
        {label}
      </label>
      <Input
        {...input}
        aria-describedby={describedBy || undefined}
        aria-invalid={Boolean(error)}
        id={fieldId}
      />
      {hint && (
        <span className="gm-client-field__hint" id={hintId}>
          {hint}
        </span>
      )}
      {error && (
        <span className="gm-client-field__error" id={errorId} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
