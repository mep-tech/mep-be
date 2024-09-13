import * as Joi from 'joi';

export const createProjectValidation = Joi.object({
  name: Joi.string().required().empty().max(100),
  projectOwner: Joi.string().required().empty().max(40),
  projectOwnerContact: Joi.string().empty().max(40),

  startDate: Joi.date().max('now').required().empty(),
  endDate: Joi.date().min(Joi.ref('startDate')).empty(),

  location: Joi.string().required().empty().max(40),

  activities: Joi.array()
    .items(Joi.string().hex().length(24)).unique(),

  gallery: Joi.array()
    .items(
      Joi.object({
        size: Joi.number().required().empty(),
        mimetype: Joi.string().required().empty().max(40),
      }),
    )
});
