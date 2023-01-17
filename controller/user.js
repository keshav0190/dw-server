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

        //twillio
        const accountSid = 'AC271a0eba0e4b3ee40855800a00ca5609';
        const authToken = 'd22923beef89c35f71a4e112df9c3605';
        const client = require('twilio')(accountSid, authToken);
        const phoneNumber = '+91'+req.body.phoneNo; // the phone number to send the OTP to
        client.messages
          .create({
            body: `Your OTP is: ${otp}`,
            from: '+15627848573', // your Twilio phone number
            to: phoneNumber
          })
          .then(message => console.log(message.sid));

        //email code
        var nodemailer = require('nodemailer');
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'keshav.axzora@gmail.com',
            pass: 'ydoppjxujykuizzf'
          }
        });

        var mailOptions = {
          from: 'keshav.axzora@gmail.com',
          to: req.body.email,
          subject: 'Welcome Email',
          text: 'Your OTP is '+otp
        };

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        
        const  apiKey = '523977b1-cfcd-11ea-9fa5-0200cd936042';        
        const sendotp = "https://2factor.in/API/V1/" + apiKey + "/SMS/" + '+91'+req.body.phoneNo + "/" + otp;
        let request_options = {
          method: 'get',
          url: sendotp
        };
        try {
          let otpResponse = await axios(request_options);
          res.status(200).json({
            status_code: 403,
            error: "Not verified",
            data: {
              id: id
            }
          })
        } catch (error) {
          return { Status: 'Failed', Details: 'Unable to send SMS' }
        }
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
