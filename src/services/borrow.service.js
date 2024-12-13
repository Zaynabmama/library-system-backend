const Book = require('../models/Book');
const Member = require('../models/Member');
const sendEmail = require('../services/email.service');

const getBorrowedBooks = async (memberId) => {
  try {
    const member = await Member.findById(memberId).populate('borrowedBooks.borrowedBookId');
    if (!member) throw new Error('Member not found.');

    const borrowedBooks = member.borrowedBooks.map(book => {
      const currentTime = Date.now();
      const returnDate = new Date(book.returnDate).getTime();
      const timeLeft = returnDate - currentTime;
      const hoursLeft = Math.ceil(timeLeft / (1000 * 60 * 60));

      return {
        bookId: book.borrowedBookId._id,
        title: book.borrowedBookId.title.en,
        daysLeft: Math.ceil(timeLeft / (1000 * 60 * 60 * 24)),
        warningFlag: hoursLeft < 12,
        expiredFlag: timeLeft < 0
      };
    });

    borrowedBooks.sort((a, b) => a.daysLeft - b.daysLeft);

    return { success: true, borrowedBooks };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const subscribeToBook = async (memberId, bookId) => {
  try {
    const member = await Member.findById(memberId);
    const book = await Book.findById(bookId);

    if (!member || !book) throw new Error('Member or Book not found.');

    if (member.subscribedBooks.includes(bookId)) {
      throw new Error('Already subscribed to this book.');
    }

    member.subscribedBooks.push(bookId);
    await member.save();

    return { success: true, message: 'Subscribed to the book successfully.' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const unsubscribeFromBook = async (memberId, bookId) => {
  try {
    const member = await Member.findById(memberId);
    if (!member) throw new Error('Member not found.');

    member.subscribedBooks = member.subscribedBooks.filter(subscribedBookId => subscribedBookId.toString() !== bookId);
    await member.save();

    return { success: true, message: 'Unsubscribed from the book successfully.' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const returnBook = async (memberId, bookId) => {
  try {
    const member = await Member.findById(memberId);
    const book = await Book.findById(bookId);

    if (!member || !book) throw new Error('Member or Book not found.');

    const borrowedBook = member.borrowedBooks.find(b => b.borrowedBookId.toString() === bookId);
    if (!borrowedBook) throw new Error('Book not currently borrowed by the member.');

    const currentDate = new Date();
    const isOnTime = currentDate <= new Date(borrowedBook.returnDate);

    member.borrowedBooks = member.borrowedBooks.filter(b => b.borrowedBookId.toString() !== bookId);

    member.returnRate += isOnTime ? 5 : -5;
    member.returnRate = Math.max(0, Math.min(100, member.returnRate));

    book.numberOfAvailableCopies += 1;

    await member.save();
    await book.save();

    return { success: true, message: 'Book returned successfully.' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const publishBook = async (bookId) => {
  try {
    const book = await Book.findById(bookId).populate('subscribers');
    if (!book) throw new Error('Book not found.');

    if (book.isPublished) throw new Error('Book is already published.');

    book.isPublished = true;
    book.publishedDate = new Date();
    await book.save();

    const subscriberEmails = book.subscribers.map(subscriber => subscriber.email);

    emailService.sendEmail(subscriberEmails, 'Book Published', `The book "${book.title.en}" has been published.`);

    return { success: true, message: 'Book published and subscribers notified.' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const unpublishBook = async (bookId) => {
  try {
    const book = await Book.findById(bookId);
    if (!book) throw new Error('Book not found.');

    if (!book.isPublished) throw new Error('Book is already unpublished.');

    book.isPublished = false;
    await book.save();

    return { success: true, message: 'Book unpublished successfully.' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const getKPIs = async () => {
  try {
    const totalBooks = await Book.countDocuments();
    const publishedBooks = await Book.countDocuments({ isPublished: true });

    const booksPublishRate = totalBooks ? ((publishedBooks / totalBooks) * 100).toFixed(2) : 0;

    const members = await Member.find();
    const averageReturnRate = members.length
      ? (members.reduce((acc, member) => acc + member.returnRate, 0) / members.length).toFixed(2)
      : 0;

    return {
      success: true,
      KPIs: {
        booksPublishRate: `${booksPublishRate}%`,
        averageReturnRate: `${averageReturnRate}%`
      }
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = {
  getBorrowedBooks,
  subscribeToBook,
  unsubscribeFromBook,
  returnBook,
  publishBook,
  unpublishBook,
  getKPIs
};
