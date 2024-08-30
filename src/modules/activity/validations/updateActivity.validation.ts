import * as Joi from 'joi';

export const updateActivityValidation = Joi.object({
  alias: Joi.string().empty().max(7),
  name: Joi.string().empty().max(40),
});
