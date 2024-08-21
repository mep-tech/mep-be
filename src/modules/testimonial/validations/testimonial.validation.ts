import * as Joi from 'joi';

export const createTestimonialValidation = Joi.object({
  names: Joi.string().required().empty().max(40),
  message: Joi.string().required().empty().max(1000),
  company: Joi.string().required().empty().max(40),
  role: Joi.string().required().empty().max(40),
});
