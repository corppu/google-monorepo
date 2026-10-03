import type { Group } from '../types/Group';
import {
  NullableValidator,
  ObjectValidator,
  OptionalValidator,
  StringValidator,
  type Validator,
} from './Validator';

const optionalString = (fieldKey: string) =>
  OptionalValidator(NullableValidator(StringValidator({ fieldKey })));

export const GoogleGroupValidator: Validator<Group> = ObjectValidator<Group>(
  'Group',
  {
    description: optionalString('description'),
    email: optionalString('email'),
    id: optionalString('id'),
    name: optionalString('name'),
  },
);
