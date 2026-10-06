import type { EventCreator } from '../types/EventCreator';
import {
  ObjectValidator,
  OptionalValidator,
  StringValidator,
  type Validator,
} from './Validator';

const optionalString = (fieldKey: string) =>
  OptionalValidator(StringValidator({ fieldKey }));

export const GoogleEventCreatorValidator: Validator<EventCreator> =
  ObjectValidator<EventCreator>('EventCreator', {
    displayName: optionalString('displayName'),
    email: optionalString('email'),
  });
