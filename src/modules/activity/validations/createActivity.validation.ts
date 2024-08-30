import * as Joi from 'joi';

export const createActivityValidation = Joi.object({
  alias: Joi.string().empty().max(7),
  name: Joi.string().required().empty().max(40),
});
