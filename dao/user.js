const db = require('../db/db');

class UserDAO {
  async createUser(firstName, lastName, email, phoneNo, password) {
    const [id] = await db('user')
      .insert({
        email,
        phone_no: phoneNo,
        password,
        first_name: firstName,
        last_name: lastName,
      })
      .returning('id');

    return id;
  }
}

module.exports = new UserDAO();
