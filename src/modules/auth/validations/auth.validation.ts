import * as Joi from 'joi';

export const createUserValidation = Joi.object({
  names: Joi.string().required().empty().min(1).max(40),
  email: Joi.string().email().required().empty(),
  phone: Joi.string().required().empty().max(40),
  role: Joi.string().required().empty().max(40),
});

export const createOrganizerValidation = Joi.object({
  names: Joi.string().required().empty().min(1).max(40),
  email: Joi.string().email().optional().empty(),
  phone: Joi.string().optional().empty().max(40),
});
