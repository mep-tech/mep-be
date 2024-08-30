import * as Joi from 'joi';

export const updateProjectGalleryValidation = Joi.object({
  gallery: Joi.array().items(Joi.string().hex().length(24)).unique().required().empty()
});
