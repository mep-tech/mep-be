import * as Joi from 'joi';

export const createCertificateValidation = Joi.object({
  title: Joi.string().required().empty().max(100),
  description: Joi.string().optional().empty().max(255),
});
