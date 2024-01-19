import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export function IsStartWith(
  startWith: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'IsStartWith',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        defaultMessage(): string {
          return `${propertyName} should start with ${startWith}`;
        },
        validate(value: string) {
          try {
            return value.startsWith(startWith);
          } catch (e) {
            return false;
          }
        },
      },
    });
  };
}
