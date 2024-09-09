import * as Joi from 'joi';

export const createTestimonialValidation = Joi.object({
  names: Joi.string().required().empty().max(40),
  message: Joi.string().required().empty().min(80).max(400),
  company: Joi.string().required().empty().max(40),
  role: Joi.string().required().empty().max(40),
}).unknown(true);
