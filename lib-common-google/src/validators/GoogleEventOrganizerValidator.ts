import type { EventOrganizer } from '../types/EventOrganizer';
import { ObjectValidator, OptionalValidator, StringValidator, type Validator } from './Validator';

const optionalString = (fieldKey: string) => OptionalValidator(StringValidator({ fieldKey }));

export const GoogleEventOrganizerValidator: Validator<EventOrganizer> = ObjectValidator<EventOrganizer>('EventOrganizer', {
  email: optionalString('email'),
  displayName: optionalString('displayName')
});