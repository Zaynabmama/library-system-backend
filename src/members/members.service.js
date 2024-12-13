const Member = require('./member.model');
const { getAge } = require('../utils/helpers.js'); 

class MemberService {
  async addMember(memberData) {
    const newMember = new Member(memberData);
    return await newMember.save();
  }

  async updateMember(memberId, memberData) {
    const updatedMember = await Member.findByIdAndUpdate(memberId, memberData, { new: true });
    if (!updatedMember) {
      throw new Error('Member not found');
    }
    return updatedMember;
  }

  async deleteMember(memberId) {
    const deletedMember = await Member.findByIdAndDelete(memberId);
    if (!deletedMember) {
      throw new Error('Member not found');
    }
    return deletedMember;
  }

  async getMemberById(memberId) {
    const member = await Member.findById(memberId);
    if (!member) {
      throw new Error('Member not found');
    }
    return member;
  }

  
  async getMemberProfileById(memberId) {
    const member = await Member.findById(memberId);
    if (!member) {
      throw new Error('Member not found');
    }

    const returnRate = await this.calculateReturnRate(memberId);

    return {
      name: member.name,
      username: member.username,
      email: member.email,
      birthDate: member.birthDate,
      subscribedBooks: member.subscribedBooks,
      borrowedBooks: member.borrowedBooks,
      returnRate: returnRate,
    };
  }

 }
  
module.exports = MemberService;