const otpDAO = require('../dao/otp');

class OtpService {
    addOtp(otpDto) {
        const { otp, user_id } = otpDto;
        return otpDAO.addOtp(otp, user_id);
    }

    getOtp(otpDto) {
        const { id } = userDto;
        return otpDAO.getOtp(id);
    }
}

module.exports = new OtpService();
