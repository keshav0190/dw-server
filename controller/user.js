const userService = require('../service/user');
const otpService = require('../service/otp');
const axios = require('axios');

class UserController {
  async createUser(req, res) {
    try {
      const id = await userService.createUser(req.body);
      if(id)
      {
        res.status(200).json({
          status_code: 403,
          error: "Not verified",
          data: {
            id: id
          }
        })
      }else{
        res.status(500).json({
          status_code: 500,
          error: "Bad Request",
          data: {
            id: id
          }
        })
      }
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
