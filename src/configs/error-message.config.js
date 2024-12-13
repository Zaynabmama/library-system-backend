const HTTP_STATUS = require('./http-statuses.config'); 

module.exports = {
  VALIDATION_ERROR: {
    statusCode: HTTP_STATUS.BAD_REQUEST,
    code: 'VALIDATION_ERROR',
    message: 'There are validation errors in the request.',
  },
  BOOK_NOT_FOUND: {
    statusCode: HTTP_STATUS.NOT_FOUND,
    code: 'BOOK_NOT_FOUND',
    message: 'The requested book was not found in the system.',
  },
  BOOK_ALREADY_EXISTS: {
    statusCode: HTTP_STATUS.CONFLICT,
    code: 'BOOK_ALREADY_EXISTS',
    message: 'The  book already excist',
  },
  
  INVALID_FILE_TYPE: {
    statusCode: HTTP_STATUS.BAD_REQUEST,
    code: 'INVALID_FILE_TYPE',
    message: 'The file type is not supported. Please upload an image file.',
  },
  BOOK_ALREADY_PUBLISHED: {
    statusCode: HTTP_STATUS.BAD_REQUEST,
    code: 'BOOK_ALREADY_PUBLISHED',
    message: 'This book has already been published.',
  },
  BOOK_ALREADY_UNPUBLISHED: {
    statusCode: HTTP_STATUS.BAD_REQUEST,
    code: 'BOOK_ALREADY_UNPUBLISHED',
    message: 'This book is already unpublished.',
  },
  FILE_UPLOAD_ERROR: {
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code: 'FILE_UPLOAD_ERROR',
    message: 'There was an error uploading the file.',
  },
  INTERNAL_SERVER_ERROR: {
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred. Please try again later.',
  },
  AUTHOR_NOT_FOUND: {
    statusCode: HTTP_STATUS.NOT_FOUND,
    code: 'AUTHOR_NOT_FOUND',
    message: 'author is not excisting.',
  },
};
