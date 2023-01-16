const userService = require('../service/user');

class UserController {
  async createUser(req, res) {
    try {
      const id = await userService.createUser(req.body);
      res.status(201).json(id);
      //add otp in db
    } catch (err) {
      console.error(err);
    }
  }

  async getUser(req, res) {
    console.log('In get user',req.params.id);
    try {
      const id = await userService.getUser(req.params.id);
      console.log('return data',id);
      res.status(200).json(id);
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = new UserController();
