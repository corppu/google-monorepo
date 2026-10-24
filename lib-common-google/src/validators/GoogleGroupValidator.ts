import type { Group } from '../types/Group';
import {
  ArrayValidator,
  NullableValidator,
  ObjectValidator,
  OptionalValidator,
  StringValidator,
  type Validator,
} from './Validator';

const optionalString = (fieldKey: string) =>
  OptionalValidator(NullableValidator(StringValidator({ fieldKey })));
const optionalStringArray = (fieldKey: string) =>
  OptionalValidator(
    NullableValidator(ArrayValidator(fieldKey, StringValidator({ fieldKey }))),
  );

export const GoogleGroupValidator: Validator<Group> = ObjectValidator<Group>(
  'Group',
  {
    aliases: optionalStringArray('aliases'),
    description: optionalString('description'),
    email: optionalString('email'),
    id: optionalString('id'),
    name: optionalString('name'),
    nonEditableAliases: optionalStringArray('nonEditableAliases'),
  },
);
