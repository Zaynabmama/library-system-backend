const Joi = require('joi');
const { Types: { ObjectId } } = require('mongoose');

const createBookSchema = Joi.object({
  title: Joi.object({
    en: Joi.string().required(),
    ar: Joi.string().required(),
  }).required(),
  genre: Joi.string().required(),
  description: Joi.object({
    en: Joi.string(),
    ar: Joi.string(),
  }).required(),
  numberOfAvailableCopies: Joi.number().integer().min(0).required(),
  isBorrowable: Joi.boolean().default(true),
  isOpenToReviews: Joi.boolean().default(true),
  isPublished: Joi.boolean().default(false),
  numberOfBorrowableDays: Joi.number().integer().min(1).required(),
  minAge: Joi.number().integer().min(0).required(),
  authorId: Joi.string()
    .custom((value, helpers) => {
      if (!ObjectId.isValid(value)) {
        return helpers.message('Invalid authorId');
      }
      return value;
    })
    .required(),
  publishedDate: Joi.date().required(),
});

const updateBookSchema = createBookSchema
  .fork(Object.keys(createBookSchema.describe().keys), (schema) => schema.optional())
  .keys({
    isPublished: Joi.forbidden(),
  });

module.exports = { createBookSchema, updateBookSchema };
