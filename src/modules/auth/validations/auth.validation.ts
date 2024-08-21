import * as Joi from 'joi';

export const authLoginValidation = Joi.object({
  username: Joi.string().required().empty().max(40),
  password: Joi.string().required().empty().max(40),
});
