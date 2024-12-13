const ERROR_MESSAGES = require('../configs/error-message.config');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.map((err) => err.message);

      return res
        .status(ERROR_MESSAGES.VALIDATION_ERROR.statusCode)
        .json({
          message: ERROR_MESSAGES.VALIDATION_ERROR.message,
          errors: errorMessages,
        });
    }

    next();
  };
};

module.exports = { validateRequest };
