const Joi = require('joi');

const createAuthorSchema = Joi.object({
  name: Joi.object({
    en: Joi.string().required(),
    ar: Joi.string().required(),
  }).required(),
  email: Joi.string().email().required(),
  biography: Joi.object({
    en: Joi.string(),
    ar: Joi.string(),
  }),
  profileImageUrl: Joi.string().uri(),
  birthDate: Joi.date(),
});

const updateAuthorSchema = createAuthorSchema
  .fork(Object.keys(createAuthorSchema.describe().keys), (schema) => schema.optional());

module.exports = { createAuthorSchema, updateAuthorSchema };
