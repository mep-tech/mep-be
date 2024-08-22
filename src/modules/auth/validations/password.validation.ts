import * as Joi from 'joi';

export const passwordChangeValidation = Joi.object({
  oldPwd: Joi.string().required().empty().min(6).max(40),
  newPwd: Joi.string().required().empty().min(6).max(40),
});

export const passwordForgotValidation = Joi.object({
  email: Joi.string().email().required().empty().min(6).max(40),
});

export const passwordResetValidation = Joi.object({
  pwd: Joi.string().required().empty().min(6).max(40),
  confirmPwd: Joi.string().required().empty().min(6).max(40),
});
