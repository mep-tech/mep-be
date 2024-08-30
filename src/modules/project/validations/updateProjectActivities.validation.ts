import * as Joi from 'joi';

export const updateProjectActivitiesValidation = Joi.object({
  activities: Joi.array().items(Joi.string().hex().length(24)).unique().required().empty()
});
