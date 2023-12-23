import { validate, ValidatorOptions } from 'class-validator';

export const validateDto = async (
  object: object,
  validatorOptions: ValidatorOptions = {},
) => {
  const errors = await validate(object, validatorOptions);
  if (errors.length) throw errors;
};
