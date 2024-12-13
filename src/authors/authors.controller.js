const express = require('express');
const AuthorService = require('./authors.service');
const UploadService = require('../services/upload.service');
const HTTP_STATUS = require('../configs/http-statuses.config');
const ERROR_MESSAGES = require('../configs/error-message.config');
const { validateRequest } = require('../middlewares/validation.middleware');
const { createAuthorSchema, updateAuthorSchema } = require('./authors.validation');

class AuthorController {
  constructor() {
    this.router = express.Router();
    this.authorService = new AuthorService();
    this.uploadService = new UploadService();
    this.initializeRoutes();
  }
  initializeRoutes() {
    this.router.post(
      '/add-author',
      this.uploadService.uploadFile.bind(this.uploadService),
      validateRequest(createAuthorSchema),
      this.addAuthor.bind(this)
    );
    this.router.put(
      '/update-author/:id',
      this.uploadService.uploadFile.bind(this.uploadService),
      validateRequest(updateAuthorSchema),
      this.updateAuthor.bind(this)
    );
    this.router.delete(
      '/delete-author/:id',
      this.deleteAuthor.bind(this)
    );

    this.router.get(
      '/author/:id',
      this.getAuthorById.bind(this)
    );

    this.router.get(
      '/author-profile/:id',
      this.getAuthorProfileById.bind(this)
    );
  }

  async addAuthor(req, res) {
    const { name, email, biography, birthDate } = req.body;
    try {
      const profileImageUrl = req.file ? `/uploads/${req.file.filename}` : null;
      const authorData = {
        name,
        email,
        biography,
        profileImageUrl,
        birthDate,
      };
      const author = await this.authorService.addAuthor(authorData);
      return res.status(HTTP_STATUS.CREATED).json(author);
    } catch (error) {
      console.error(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(ERROR_MESSAGES.message);
    }
  }

  async updateAuthor(req, res) {
    try {
      const { id: authorId } = req.params;
      const authorData = {
        ...req.body,
        profileImageUrl: req.file ? `/uploads/${req.file.filename}` : null,
      };
      if (req.file) {
        const existingAuthor = await this.authorService.getAuthorById(authorId);
        if (existingAuthor.profileImageUrl) {
          await UploadService.deleteFile(existingAuthor.profileImageUrl);
        }
      }
      const updatedAuthor = await this.authorService.updateAuthor(authorId, authorData);
      return res.status(HTTP_STATUS.OK).json(updatedAuthor);
    } catch (error) {
      console.error(error);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.message });
    }
  }

  async deleteAuthor(req, res) {
    try {
      const { id: authorId } = req.params;
      const author = await this.authorService.getAuthorById(authorId);
      if (author.profileImageUrl) {
        await UploadService.deleteFile(author.profileImageUrl);
      }
      await this.authorService.deleteAuthorById(authorId);
      return res.status(HTTP_STATUS.NO_CONTENT).json({ message: 'Author deleted successfully' });
    } catch (error) {
      console.error(error);
      if (error.message === ERROR_MESSAGES.AUTHOR_NOT_FOUND) {
        return res.status(HTTP_STATUS.NOT_FOUND).json(ERROR_MESSAGES.AUTHOR_NOT_FOUND.message);
      }
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json(ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message);
    }
  }

  async getAuthorById(req, res) {
    try {
      const { id: authorId } = req.params;
      const author = await this.authorService.getAuthorById(authorId);
      return res.status(HTTP_STATUS.OK).json(author);
    } catch (error) {
      console.error(error);
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json(ERROR_MESSAGES.AUTHOR_NOT_FOUND.message);
    }
  }

  async getAuthorProfileById(req, res) {
    try {
      const { id: authorId } = req.params;
      const language = req.headers['accept-language'] || 'en';
      const profile = await this.authorService.getAuthorProfileById(authorId, language);
      return res.status(HTTP_STATUS.OK).json(profile);
    } catch (error) {
      console.error(error);
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json(ERROR_MESSAGES.AUTHOR_NOT_FOUND);
    }
  }
}

module.exports = AuthorController;
