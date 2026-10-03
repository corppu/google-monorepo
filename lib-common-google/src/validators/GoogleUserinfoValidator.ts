import type { Userinfo } from "../types/Userinfo";
import {
  NullableValidator,
  ObjectValidator,
  OptionalValidator,
  StringValidator,
  ValidationPattern,
  type Validator,
} from "./Validator";

const optionalString = (fieldKey: string) =>
  OptionalValidator(NullableValidator(StringValidator({ fieldKey })));

export const GoogleUserinfoValidator: Validator<Userinfo> =
  ObjectValidator<Userinfo>("Userinfo", {
    id: optionalString("id"),
    email: StringValidator({
      fieldKey: "email",
      minLength: "a@gmail.com".length,
      pattern: ValidationPattern.gmail,
    }),
    name: optionalString("name"),
    picture: optionalString("picture"),
  });
