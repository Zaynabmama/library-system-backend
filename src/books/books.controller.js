const express = require('express');
const HTTP_STATUS = require('../configs/http-statuses.config');
const ERROR_MESSAGES = require('../configs/error-message.config');
const BookService = require('./books.service');
const UploadService = require('../services/upload.service');
const { validateRequest } = require('../middlewares/validation.middleware');
const { createBookSchema, updateBookSchema } = require('./books.validation');


class BookController {
  constructor() {
    this.router = express.Router(); 
    this.bookService = new BookService();
    this.uploadService = new UploadService();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post('/add-book',
    this.uploadService.uploadFile.bind(this.uploadService),
    validateRequest(createBookSchema),
    this.createBook.bind(this)); 

    this.router.get('/books', this.getBooks.bind(this));
    this.router.get('/book/:id', this.fetchBookById.bind(this));
    this.router.put('/book/:id',
    this.uploadService.uploadFile.bind(this.uploadService),
    validateRequest(updateBookSchema),
    this.updateBook.bind(this));
    this.router.delete('/book/:id', this.deleteBook.bind(this));
     
  }


  async createBook(req, res) {
    try {
      const bookData = {
        ...req.body, 
        coverImageUrl: req.file ? `/uploads/${req.file.filename}` : null, 
      };
  
      const result = await this.bookService.createBook(bookData);
  
  
      return res
      .status(HTTP_STATUS.CREATED)
      .json(result);
    } catch (error) {
      console.error(error);
  
      if (error?.message === ERROR_MESSAGES.AUTHOR_NOT_FOUND.message) {
        return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(ERROR_MESSAGES.AUTHOR_NOT_FOUND.message);
      }
  
      if (error.message === ERROR_MESSAGES.BOOK_ALREADY_EXISTS.message) {
        return res
        .status(ERROR_MESSAGES.BOOK_ALREADY_EXISTS.statusCode)
        .json(ERROR_MESSAGES.BOOK_ALREADY_EXISTS.message);
      }
  
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message);
    }
  }

  async getBooks(req, res) {
    const { page = 1, limit = 10, genre, search } = req.query;

    try {
      const { books, pagination } = await this.bookService.fetchBooks({ page, limit, genre, search });

      return res
        .status(HTTP_STATUS.OK)
        .json({
        books,
        pagination
      });
    } catch (error) {
      
      if (error.message === ERROR_MESSAGES.BOOK_NOT_FOUND.message) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json(ERROR_MESSAGES.BOOK_NOT_FOUND.message);
      }
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message);
    }
  }
  
  async fetchBookById(req, res) {
    const { id: bookId } = req.params;

    try {
      const book = await this.bookService.getBookById(bookId);
      return res
        .status(HTTP_STATUS.OK)
        .json(book);
    } catch (error) {
      if (error.message === ERROR_MESSAGES.BOOK_NOT_FOUND) {
        return res
          .status(ERROR_MESSAGES.BOOK_NOT_FOUND.statusCode)
          .json(ERROR_MESSAGES.BOOK_NOT_FOUND.message );
      }
    }
  }

   async updateBook(req, res) {
     try {
       const { id: bookId } = req.params;
       const bookData = {
         ...req.body,
         coverImageUrl: req.file ? `/uploads/${req.file.filename}` : null, 
      
       };
       if (req.file) {
        const existingBook = await this.bookService.getBookById(bookId);
        if (existingBook.coverImageUrl) {
          await UploadService.deleteFile(existingBook.coverImageUrl); 
        }
      }
  k
       const result = await this.bookService.updateBook(bookId, bookData);
  
       return res
         .status(HTTP_STATUS.OK)
         .json(result);
     } catch (error) {
      console.error(error);
       return res
         .status(HTTP_STATUS.BAD_REQUEST) 
         .json({ error: error.message });
     }
   }

   async deleteBook(req, res) {
    try {
      const { id: bookId } = req.params;
      const book = await this.bookService.getBookById(bookId);
      
      await UploadService.deleteFile(book.coverImageUrl);
      
      await this.bookService.deleteBookById(bookId);
      return res.status(HTTP_STATUS.NO_CONTENT).json({ message: 'Book deleted successfully' });
    } catch (error) {
      console.log(error);
     
      if (error.message === ERROR_MESSAGES.BOOK_NOT_FOUND.message) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(ERROR_MESSAGES.BOOK_NOT_FOUND.message);
      }
   return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message);
    }
  }
  

}  
module.exports = BookController; 
