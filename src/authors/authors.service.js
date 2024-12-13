const Author = require('./authors.model');
const ERROR_MESSAGES = require('../configs/error-message.config'); 

class AuthorService {
  async addAuthor(authorData) {
    const newAuthor = new Author(authorData);
    return await newAuthor.save();
  }

  async updateAuthor(authorId, authorData) {
    const updatedAuthor = await Author.findByIdAndUpdate(authorId, authorData, { new: true });
    if (!updatedAuthor) {
      throw new Error(ERROR_MESSAGES.AUTHOR_NOT_FOUND);
    }
    return updatedAuthor;
  }

  async deleteAuthorById(authorId) {
    const deletedAuthor = await Author.findByIdAndDelete(authorId);
    if (!deletedAuthor) {
      throw new Error('Author not found');
    }
    return deletedAuthor;
  }

  async getAuthorById(authorId) {
    const author = await Author.findById(authorId);
    if (!author) {
      throw new Error(ERROR_MESSAGES.AUTHOR_NOT_FOUND);
    }
    return author;
  }

  async getAuthorProfileById(authorId, language) {
    const author = await Author.findById(authorId);
    if (!author) {
      throw new Error(ERROR_MESSAGES.AUTHOR_NOT_FOUND);
    }

    return {
      name: author.name[language] || author.name.en,
      biography: author.biography[language] || author.biography.en,
      profileImageUrl: author.profileImageUrl,
    };
  }
}

module.exports =  AuthorService;
