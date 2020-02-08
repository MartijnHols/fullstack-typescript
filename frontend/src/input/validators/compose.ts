import { FieldValidator } from 'final-form'

/* eslint-disable @typescript-eslint/no-explicit-any */
const compose = (
  ...validators: Array<FieldValidator<any>>
): FieldValidator<any> => (...args: Parameters<FieldValidator<any>>) =>
  validators.reduce<string | void>(
    (error, validator: FieldValidator<any>) => error || validator(...args),
    undefined,
  )

export default compose
