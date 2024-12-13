const HTTP_STATUS = require('../configs/http-statuses.config');
const ERROR_MESSAGES = require('../configs/error-message.config');

const errorMiddleware = (err, req, res, next) => {
  console.error(err.message); 

  const status = err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = err.message || ERROR_MESSAGES.SERVER_ERROR;

  res.status(status).json({ error: message });
};

module.exports = errorMiddleware;
