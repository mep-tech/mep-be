import * as Joi from 'joi';

export const updateProjectValidation = Joi.object({
  name: Joi.string().required().empty().max(100),
  projectOwner: Joi.string().required().empty().max(40),
  projectOwnerContact: Joi.string().empty().max(40),

  startDate: Joi.date().max('now').required().empty(),
  endDate: Joi.date().min(Joi.ref('startDate')).empty(),

  location: Joi.string().required().empty().max(40),
});
