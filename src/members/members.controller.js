const express = require('express');
const MemberService = require('../members/member.service');
const HTTP_STATUS = require('../configs/http-statuses.config');
const ERROR_MESSAGES = require('../configs/error-message.config');

class MemberController {
  constructor() {
    this.router = express.Router();
    this.memberService = new MemberService();
    this.initializeRoutes();
  }

  async addMember(req, res) {
    try {
      const memberData = req.body;
      const member = await this.memberService.addMember(memberData);
      return res.status(HTTP_STATUS.CREATED).json(member);
    } catch (error) {
      console.error(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(ERROR_MESSAGES.message);
    }
  }

  async updateMember(req, res) {
    try {
      const { id: memberId } = req.params;
      const memberData = req.body;
      const updatedMember = await this.memberService.updateMember(memberId, memberData);
      return res.status(HTTP_STATUS.OK).json(updatedMember);
    } catch (error) {
      console.error(error);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.message });
    }
  }

  async deleteMember(req, res) {
    try {
      const { id: memberId } = req.params;
      await this.memberService.deleteMember(memberId);
      return res.status(HTTP_STATUS.NO_CONTENT).json({ message: 'Member deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(ERROR_MESSAGES.INTERNAL_SERVER_ERROR.message);
    }
  }

  async getMemberProfile(req, res) {
    try {
      const { id: memberId } = req.params;
      const memberProfile = await this.memberService.getMemberProfileById(memberId);
      return res.status(HTTP_STATUS.OK).json(memberProfile);
    } catch (error) {
      console.error(error);
      return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Member not found' });
    }
  }

  async borrowBook(req, res) {
    try {
      const memberId = req.headers['id']; 
      const { bookId } = req.body; 
      if (!memberId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json('Member ID is required');
      }

      const result = await this.memberService.borrowBook(memberId, bookId);
      return res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      console.error(error);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.message });
    }
  }
  async getBorrowedBooks(req, res) {
    try {
      const { memberId } = req.headers;
      if (!memberId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Member ID is required in headers' });
      }

      const borrowedBooks = await this.memberService.getBorrowedBooksWithTimeLeft(memberId);
      return res.status(HTTP_STATUS.OK).json(borrowedBooks);
    } catch (error) {
      console.error(error);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.message });
    }
  }

  async subscribeToBook(req, res) {
    try {
      const { memberId } = req.headers;
      const { bookId } = req.body;
      if (!memberId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Member ID is required in headers' });
      }

      const result = await this.memberService.subscribeToBook(memberId, bookId);
      return res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      console.error(error);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.message });
    }
  }

  async unsubscribeFromBook(req, res) {
    try {
      const { memberId } = req.headers;
      const { bookId } = req.body;
      if (!memberId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Member ID is required in headers' });
      }

      const result = await this.memberService.unsubscribeFromBook(memberId, bookId);
      return res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      console.error(error);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.message });
    }
  }

  async returnBook(req, res) {
    try {
      const { memberId } = req.headers;
      const { bookId } = req.body;
      if (!memberId) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Member ID is required in headers' });
      }

      const result = await this.memberService.returnBook(memberId, bookId);
      return res.status(HTTP_STATUS.OK).json(result);
    } catch (error) {
      console.error(error);
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ error: error.message });
    }
  }



  initializeRoutes() {
    this.router.post('/add-member', this.addMember.bind(this));
    this.router.put('/update-member/:id', this.updateMember.bind(this));
    this.router.delete('/delete-member/:id', this.deleteMember.bind(this));
    this.router.get('/member-profile/:id', this.getMemberProfile.bind(this));
    this.router.post('/borrow-book', this.borrowBook.bind(this));
    this.router.get('/borrowed-books', this.getBorrowedBooks.bind(this));
    this.router.post('/subscribe-book', this.subscribeToBook.bind(this));
    this.router.post('/unsubscribe-book', this.unsubscribeFromBook.bind(this));
    this.router.post('/return-book', this.returnBook.bind(this));
  }
}

module.exports = MemberController;
