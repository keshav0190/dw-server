const db = require('../db/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

class OtpDAO {
  async addOtp(otp, user_id) {
    const [id] = await db('otp')
      .insert({
        otp,
        user_id
      })
      .returning('id');

    return id;
  }

  async getOtp(id) {
    return id;
  }
}

module.exports = new OtpDAO();
