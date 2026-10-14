enum ValidationErrorMessage {
  expectedType = 'Expected field {fieldKey} value {fieldValue} to be type of {expectedType}, but it was {actualType}.',
  expectedLength = 'Expected field {fieldKey} value {fieldValue} to have length between {minLength} and {maxLength}, but it was {actualLength}.',
  expectedPattern = 'Expected field {fieldKey} value {fieldValue} to match pattern {pattern}.',
}

export enum ValidationPattern {
  gmail = '^[a-zA-Z0-9.]+@gmail\\.com\$',
}

type ExpectedTypePayload = {
  actualType: string;
  expectedType: string;
  fieldKey: string;
  fieldValue: unknown;
};
type ExpectedLengthPayload = {
  actualLength: number;
  fieldKey: string;
  fieldValue: string;
  maxLength: number;
  minLength: number;
};
type ExpectedPatternPayload = {
  fieldKey: string;
  fieldValue: string;
  pattern: string;
};
type ExpectedPayload =
  ExpectedTypePayload | ExpectedLengthPayload | ExpectedPatternPayload;

function formatErrorMessage(
  template: ValidationErrorMessage.expectedType,
  values: ExpectedTypePayload,
): string;
function formatErrorMessage(
  template: ValidationErrorMessage.expectedLength,
  values: ExpectedLengthPayload,
): string;
function formatErrorMessage(
  template: ValidationErrorMessage.expectedPattern,
  values: ExpectedPatternPayload,
): string;
function formatErrorMessage(
  template: ValidationErrorMessage,
  values: Record<string, any>,
): string {
  return template.replace(/{(\w+)}/g, (match, key) =>
    key in values ? String(values[key]) : match,
  );
}

class ValidationError extends Error {
  constructor(
    public readonly message: string,
    public readonly messageTemplateKey: string,
    public readonly messageTemplateValues?: ExpectedPayload,
    public readonly children?: ValidationError[],
  ) {
    super(message, { cause: messageTemplateValues });
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export type ValidationResult<T> = {
  error: ValidationError | undefined;
  output: T | undefined;
};

export type Validator<T> = (input: unknown) => ValidationResult<T>;

export const unwrapValidationResult = <T>(result: ValidationResult<T>): T => {
  if (result.error) {
    throw result.error;
  }
  if (result.output === undefined) {
    throw new Error('Validation completed without an output.');
  }
  return result.output;
};

export type StringValidatorProps = {
  fieldKey: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
};
export const StringValidator =
  ({
    fieldKey,
    maxLength = Number.POSITIVE_INFINITY,
    minLength = 0,
    pattern,
  }: StringValidatorProps): Validator<string> =>
  (fieldValue: unknown) => {
    const actualType = typeof fieldValue;
    if (typeof fieldValue !== 'string') {
      const payload: ExpectedTypePayload = {
        actualType,
        expectedType: 'string',
        fieldKey,
        fieldValue,
      };
      return {
        error: new ValidationError(
          formatErrorMessage(ValidationErrorMessage.expectedType, payload),
          'expectedType',
          payload,
        ),
        output: undefined,
      };
    }
    const actualLength = fieldValue.length;
    if (actualLength < minLength || actualLength > maxLength) {
      const payload: ExpectedLengthPayload = {
        actualLength,
        fieldKey,
        fieldValue,
        maxLength,
        minLength,
      };
      return {
        error: new ValidationError(
          formatErrorMessage(ValidationErrorMessage.expectedLength, payload),
          'expectedLength',
          payload,
        ),
        output: undefined,
      };
    }
    if (pattern && !new RegExp(pattern).test(fieldValue)) {
      const payload: ExpectedPatternPayload = { fieldKey, fieldValue, pattern };
      return {
        error: new ValidationError(
          formatErrorMessage(ValidationErrorMessage.expectedPattern, payload),
          'expectedPattern',
          payload,
        ),
        output: undefined,
      };
    }
    return { error: undefined, output: fieldValue };
  };

export const NumberValidator =
  (fieldKey: string): Validator<number> =>
  (fieldValue: unknown) => {
    if (typeof fieldValue !== 'number' || !Number.isFinite(fieldValue)) {
      const payload: ExpectedTypePayload = {
        actualType: typeof fieldValue,
        expectedType: 'number',
        fieldKey,
        fieldValue,
      };
      return {
        error: new ValidationError(
          formatErrorMessage(ValidationErrorMessage.expectedType, payload),
          'expectedType',
          payload,
        ),
        output: undefined,
      };
    }
    return { error: undefined, output: fieldValue };
  };

export const BooleanValidator =
  (fieldKey: string): Validator<boolean> =>
  (fieldValue: unknown) => {
    if (typeof fieldValue !== 'boolean') {
      const payload: ExpectedTypePayload = {
        actualType: typeof fieldValue,
        expectedType: 'boolean',
        fieldKey,
        fieldValue,
      };
      return {
        error: new ValidationError(
          formatErrorMessage(ValidationErrorMessage.expectedType, payload),
          'expectedType',
          payload,
        ),
        output: undefined,
      };
    }
    return { error: undefined, output: fieldValue };
  };

export const ObjectValidator =
  <T extends Record<string, any>>(
    fieldKey: string,
    shape: { [K in keyof T]: Validator<T[K]> },
  ): Validator<T> =>
  (fieldValue: unknown) => {
    if (
      typeof fieldValue !== 'object' ||
      fieldValue === null ||
      Array.isArray(fieldValue)
    ) {
      const payload: ExpectedTypePayload = {
        actualType: fieldValue === null ? 'null' : typeof fieldValue,
        expectedType: 'object',
        fieldKey,
        fieldValue,
      };
      return {
        error: new ValidationError(
          formatErrorMessage(ValidationErrorMessage.expectedType, payload),
          'expectedType',
          payload,
        ),
        output: undefined,
      };
    }

    const output = {} as T;
    const children: ValidationError[] = [];
    const obj = fieldValue as Record<string, unknown>;

    for (const key in shape) {
      const res = shape[key](obj[key]);
      if (res.error) {
        children.push(res.error);
      } else if (res.output !== undefined) {
        output[key] = res.output;
      }
    }

    if (children.length > 0) {
      return {
        error: new ValidationError(
          `Object validation failed for ${fieldKey}`,
          'objectFieldsInvalid',
          undefined,
          children,
        ),
        output: undefined,
      };
    }
    return { error: undefined, output };
  };

export const ArrayValidator =
  <T>(fieldKey: string, itemValidator: Validator<T>): Validator<T[]> =>
  (fieldValue: unknown) => {
    if (!Array.isArray(fieldValue)) {
      const payload: ExpectedTypePayload = {
        actualType: typeof fieldValue,
        expectedType: 'array',
        fieldKey,
        fieldValue,
      };
      return {
        error: new ValidationError(
          formatErrorMessage(ValidationErrorMessage.expectedType, payload),
          'expectedType',
          payload,
        ),
        output: undefined,
      };
    }

    const output: T[] = [];
    const children: ValidationError[] = [];

    fieldValue.forEach((item, _index) => {
      const res = itemValidator(item);
      if (res.error) {
        children.push(res.error);
      } else if (res.output !== undefined) {
        output.push(res.output);
      }
    });

    if (children.length > 0) {
      return {
        error: new ValidationError(
          `Array validation failed for ${fieldKey}`,
          'arrayItemsInvalid',
          undefined,
          children,
        ),
        output: undefined,
      };
    }
    return { error: undefined, output };
  };

export const NullableValidator =
  <T>(validator: Validator<T>): Validator<T | null> =>
  (fieldValue: unknown) =>
    fieldValue === null
      ? { error: undefined, output: null }
      : validator(fieldValue);

export const OptionalValidator =
  <T>(validator: Validator<T>): Validator<T | undefined> =>
  (fieldValue: unknown) =>
    fieldValue === undefined
      ? { error: undefined, output: undefined }
      : validator(fieldValue);
