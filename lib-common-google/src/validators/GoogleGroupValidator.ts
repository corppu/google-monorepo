import type { Group } from '../types/Group';
import { NullableValidator, ObjectValidator, OptionalValidator, StringValidator, type Validator } from './Validator';

const optionalString = (fieldKey: string) => OptionalValidator(NullableValidator(StringValidator({ fieldKey })));

export const GoogleGroupValidator: Validator<Group> = ObjectValidator<Group>('Group', {
  id: optionalString('id'),
  email: optionalString('email'),
  name: optionalString('name'),
  description: optionalString('description')
});