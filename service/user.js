const userDAO = require('../dao/user');

class UserService {
  createUser(userDto) {
    const { firstName, lastName, email, phoneNo, password } = userDto;
    return userDAO.createUser(firstName, lastName, email, phoneNo, password);
  }

  getUser(userDto) {
    const { id } = userDto;
    return userDAO.getUser(id);
  }
}

module.exports = new UserService();
