enum ValidationErrorMessage {
  expectedType = "Expected field {fieldKey} value {fieldValue} to be type of {expectedType}, but it was {actualType}.",
  expectedLength = "Expected field {fieldKey} value {fieldValue} to have length between {minLength} and {maxLength}, but it was {actualLength}.",
  expectedPattern = "Expected field {fieldKey} value {fieldValue} to match pattern {pattern}.",
}

export enum ValidationPattern {
  gmail = "^[a-zA-Z0-9.]+@gmail\\.com\$",
}

type ExpectedTypePayload = { fieldKey: string; fieldValue: unknown; expectedType: string; actualType: string; };
type ExpectedLengthPayload = { fieldKey: string; fieldValue: string; minLength: number; maxLength: number; actualLength: number; };
type ExpectedPatternPayload = { fieldKey: string; fieldValue: string; pattern: string; };
type ExpectedPayload = ExpectedTypePayload | ExpectedLengthPayload | ExpectedPatternPayload;

function formatErrorMessage(template: ValidationErrorMessage.expectedType, values: ExpectedTypePayload): string;
function formatErrorMessage(template: ValidationErrorMessage.expectedLength, values: ExpectedLengthPayload): string;
function formatErrorMessage(template: ValidationErrorMessage.expectedPattern, values: ExpectedPatternPayload): string;
function formatErrorMessage(template: ValidationErrorMessage, values: Record<string, any>): string {
  return template.replace(/{(\w+)}/g, (match, key) => key in values ? String(values[key]) : match);
}

class ValidationError extends Error {
  constructor(
    public readonly message: string,
    public readonly messageTemplateKey: string,
    public readonly messageTemplateValues?: ExpectedPayload,
    public readonly children?: ValidationError[],
  ) {
    super(message, { cause: messageTemplateValues });
    this.name = "ValidationError";
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export type ValidationResult<T> = {
  output: T | undefined;
  error: ValidationError | undefined;
};

export type Validator<T> = (input: unknown) => ValidationResult<T>;

export const unwrapValidationResult = <T>(result: ValidationResult<T>): T => {
  if (result.error) {
    throw result.error;
  }
  if (result.output === undefined) {
    throw new Error("Validation completed without an output.");
  }
  return result.output;
};

export type StringValidatorProps = { fieldKey: string; minLength?: number; maxLength?: number; pattern?: string; };
export const StringValidator = ({ fieldKey, minLength = 0, maxLength = Number.POSITIVE_INFINITY, pattern }: StringValidatorProps): Validator<string> =>
  (fieldValue: unknown) => {
    const actualType = typeof fieldValue;
    if (typeof fieldValue !== "string") {
      const payload: ExpectedTypePayload = { fieldKey, fieldValue, expectedType: "string", actualType };
      return { output: undefined, error: new ValidationError(formatErrorMessage(ValidationErrorMessage.expectedType, payload), "expectedType", payload) };
    }
    const actualLength = fieldValue.length;
    if (actualLength < minLength || actualLength > maxLength) {
      const payload: ExpectedLengthPayload = { fieldKey, fieldValue, minLength, maxLength, actualLength };
      return { output: undefined, error: new ValidationError(formatErrorMessage(ValidationErrorMessage.expectedLength, payload), "expectedLength", payload) };
    }
    if (pattern && !new RegExp(pattern).test(fieldValue)) {
      const payload: ExpectedPatternPayload = { fieldKey, fieldValue, pattern };
      return { output: undefined, error: new ValidationError(formatErrorMessage(ValidationErrorMessage.expectedPattern, payload), "expectedPattern", payload) };
    }
    return { output: fieldValue, error: undefined };
  };

export const NumberValidator = (fieldKey: string): Validator<number> => (fieldValue: unknown) => {
  if (typeof fieldValue !== "number" || !Number.isFinite(fieldValue)) {
    const payload: ExpectedTypePayload = { fieldKey, fieldValue, expectedType: "number", actualType: typeof fieldValue };
    return { output: undefined, error: new ValidationError(formatErrorMessage(ValidationErrorMessage.expectedType, payload), "expectedType", payload) };
  }
  return { output: fieldValue, error: undefined };
};

export const BooleanValidator = (fieldKey: string): Validator<boolean> => (fieldValue: unknown) => {
  if (typeof fieldValue !== "boolean") {
    const payload: ExpectedTypePayload = { fieldKey, fieldValue, expectedType: "boolean", actualType: typeof fieldValue };
    return { output: undefined, error: new ValidationError(formatErrorMessage(ValidationErrorMessage.expectedType, payload), "expectedType", payload) };
  }
  return { output: fieldValue, error: undefined };
};

export const ObjectValidator = <T extends Record<string, any>>(
  fieldKey: string,
  shape: { [K in keyof T]: Validator<T[K]> }
): Validator<T> => (fieldValue: unknown) => {
  if (typeof fieldValue !== "object" || fieldValue === null || Array.isArray(fieldValue)) {
    const payload: ExpectedTypePayload = { fieldKey, fieldValue, expectedType: "object", actualType: fieldValue === null ? "null" : typeof fieldValue };
    return { output: undefined, error: new ValidationError(formatErrorMessage(ValidationErrorMessage.expectedType, payload), "expectedType", payload) };
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
    return { output: undefined, error: new ValidationError(`Object validation failed for ${fieldKey}`, "objectFieldsInvalid", undefined, children) };
  }
  return { output, error: undefined };
};

export const ArrayValidator = <T>(fieldKey: string, itemValidator: Validator<T>): Validator<T[]> =>
  (fieldValue: unknown) => {
    if (!Array.isArray(fieldValue)) {
      const payload: ExpectedTypePayload = { fieldKey, fieldValue, expectedType: "array", actualType: typeof fieldValue };
      return { output: undefined, error: new ValidationError(formatErrorMessage(ValidationErrorMessage.expectedType, payload), "expectedType", payload) };
    }

    const output: T[] = [];
    const children: ValidationError[] = [];

    fieldValue.forEach((item, index) => {
      const res = itemValidator(item);
      if (res.error) {
        children.push(res.error);
      } else if (res.output !== undefined) {
        output.push(res.output);
      }
    });

    if (children.length > 0) {
      return { output: undefined, error: new ValidationError(`Array validation failed for ${fieldKey}`, "arrayItemsInvalid", undefined, children) };
    }
    return { output, error: undefined };
  };

export const NullableValidator = <T>(validator: Validator<T>): Validator<T | null> =>
  (fieldValue: unknown) => fieldValue === null ? { output: null, error: undefined } : validator(fieldValue);

export const OptionalValidator = <T>(validator: Validator<T>): Validator<T | undefined> =>
  (fieldValue: unknown) => fieldValue === undefined ? { output: undefined, error: undefined } : validator(fieldValue);
