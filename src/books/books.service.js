const Book = require('./books.model');
const ERROR_MESSAGES = require('../configs/error-message.config');

const Author = require('../authors/authors.model');

const generateISBN = () => {
  return '978' + Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
};

class BookService {
  async createBook(bookData) {
    const authorExists = await Author.exists({ _id: bookData.authorId });
    if (!authorExists) {
      throw new Error(ERROR_MESSAGES.AUTHOR_NOT_FOUND.message);
    }
    const isbn = generateISBN();

    const existingBook = await Book.findOne({ isbn});
    if (existingBook) {
      throw new Error(ERROR_MESSAGES.BOOK_ALREADY_EXISTS.message);
    }

    const newBook = new Book({
      ...bookData,
      isbn,
      publishedDate: new Date(),
      isPublished: false,
    });

    return await newBook.save();
  }

  async fetchBooks({ page = 1, limit = 10, genre, search }) {
    const query = {};

    if (genre) query.genre = genre;

    if (search) {
      query.$or = [
        { 'title.en': { $regex: search, $options: 'i' } },
        { 'isbn': { $regex: search, $options: 'i' } } 
      ];
    }

    const books = await Book.find(query)
      .sort({ createdAt: -1, authorId: 1 }) 
      .skip((page - 1) * limit)         
      .limit(Number(limit))                
      .select('-updatedAt -coverImageUrl'); 

    if (!books || books.length === 0) {
      throw new Error(ERROR_MESSAGES.BOOK_NOT_FOUND.message); 
    }

    return { books, pagination: { page, limit } };
  }

  async getBookById(bookId) {
    const book = await Book.findById(bookId).select('-updatedAt -publishedDate');
    if (!book) {
      throw new Error(ERROR_MESSAGES.BOOK_NOT_FOUND);
    }
    return book;
  }

  async updateBook(bookId, bookData) {
    
    const updatedBook = await Book.findByIdAndUpdate(bookId, bookData, { new: true });
  
    return updatedBook;
  }
  
  async deleteBookById(bookId) {
    const result = await Book.findByIdAndDelete(bookId);
    if (!result) {
      throw new Error(ERROR_MESSAGES.BOOK_NOT_FOUND.message);
    }
    return result;
  }
  
}

module.exports = BookService;
