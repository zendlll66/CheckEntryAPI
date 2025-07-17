require('dotenv').config();

//const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken  = process.env.TWILIO_AUTH_TOKEN;
const fromPhone  = process.env.TWILIO_PHONE_NUMBER;

//const client = twilio(accountSid, authToken);

async function sendOtp(phone, otp) {
  try {
    return "";
    
  } catch (error) {
    console.error('❌ Failed to send OTP:', error.message);
    throw error;
  }
}

module.exports = {
  sendOtp
};
