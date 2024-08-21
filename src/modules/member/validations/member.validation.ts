import * as Joi from 'joi';

export const memberValidation = Joi.object({
  names: Joi.string().required().empty().max(40),
  phone: Joi.string().required().empty().max(16),
  role: Joi.string().required().empty().max(40),
  order: Joi.number().optional().empty().max(40),
});
