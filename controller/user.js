const userService = require('../service/user');
const otpService = require('../service/otp');
const axios = require('axios');

class UserController {
  async createUser(req, res) {
    try {
      const id = await userService.createUser(req.body);
      if(id)
      {
        let otp = Math.floor(1000 + Math.random() * 9000);
        let odata = {
          otp: otp,
          user_id: id
        }
        const otp_id = await otpService.addOtp(odata);

        const  apiKey = '523977b1-cfcd-11ea-9fa5-0200cd936042';        
        const sendotp = "https://2factor.in/API/V1/" + apiKey + "/SMS/" + '+91'+req.body.phoneNo + "/" + otp;
        let request_options = {
          method: 'get',
          url: sendotp
        };
        try {
          let otpResponse = await axios(request_options);
          //console.log(otpResponse.data)  
          //return otpResponse.data; 
          response.status(200).json({
            status_code: 403,
            error: "Not verified",
            data: {
              id: id
            }
          })
        } catch (error) {
          return { Status: 'Failed', Details: 'Unable to send SMS' }
        }
      }
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
