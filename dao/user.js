const db = require('../db/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

class UserDAO {
  async createUser(firstName, lastName, email, phoneNo, password) {
    const [id] = await db('user')
      .insert({
        email,
        phone_no: phoneNo,
        password: bcrypt.hashSync(password, 8),
        first_name: firstName,
        last_name: lastName,
      })
      .returning('id');
    return id;
  }

  async getUser(id) {
    return id;
  }
}

module.exports = new UserDAO();
