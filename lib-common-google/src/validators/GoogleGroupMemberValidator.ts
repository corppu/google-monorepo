import type { Member } from '../types/Member';
import {
  NullableValidator,
  ObjectValidator,
  OptionalValidator,
  StringValidator,
  type Validator,
} from './Validator';

const optionalString = (fieldKey: string) =>
  OptionalValidator(NullableValidator(StringValidator({ fieldKey })));

export const GoogleGroupMemberValidator: Validator<Member> =
  ObjectValidator<Member>('Member', {
    email: optionalString('email'),
    id: optionalString('id'),
    role: optionalString('role'),
  });
