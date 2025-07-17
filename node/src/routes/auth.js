require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET||'BANKBANKBANK';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN||'1h';

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { redisClient } = require('./../utils/redis');
const { sendOtp } = require('./../utils/smsservice');
const knex = require('../db/connection'); // เชื่อมกับ DB
const { v4: uuidv4 } = require('uuid');

const { password_hash, password_verify } = require('../utils/password');

// POST /api/login
router.post('/login', (req, res) => {
  const { email,telno,password } = req.body;

  // สมมติว่าผ่านการตรวจสอบแล้ว
  const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });
  res.json({ token });
});

router.post('/checkauthtoken', (req, res) => {
  const { token } = req.body;
  
   try {
      const decoded = jwt.verify(token, SECRET_KEY);
      return res.status(200).json(decoded);
      
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
});

function generateOTP(length = 6) {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post('/sendotp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number is required' });

  try {
    
    const otpCode = generateOTP();
    console.log(phone , otpCode);
    await redisClient.set(`otp:${phone}`, otpCode, { EX: 300 }); // หมดอายุใน 5 นาที    
    await sendOtp(phone, otpCode);

    res.json({ success: true, message: 'OTP sent' });
  } catch (error) {
    console.error('Error sending OTP:', error);    
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

router.post('/verifyotp', async (req, res) => {
  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ error: 'Phone and OTP code are required' });
  }

  try {
    const key = `otp:${phone}`;
    const savedOtp = await redisClient.get(key);

    if (!savedOtp) {
      return res.status(400).json({ error: 'OTP expired or not found' });
    }

    if (savedOtp !== code) {
      return res.status(400).json({ error: 'Invalid OTP code' });
    }

    await redisClient.del(key); // ลบ OTP ทันทีเมื่อใช้แล้ว
    return res.json({ message: '✅ OTP verified successfully' });

  } catch (err) {
    console.error('❌ Error verifying OTP:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/verifyotpandregister', async (req, res) => {
  const { phone, otp , password } = req.body;
  if (!phone || !otp) return res.status(400).json({ error: 'Phone and OTP are required' });
  if (!password) return res.status(400).json({ error: 'Password are required' });

  const key = `otp:${phone}`;
  const storedOtp = await redisClient.get(key);

  if (storedOtp !== otp) {
    return res.status(401).json({ error: 'Invalid OTP' });
  }

  // ✅ OTP ถูกต้องแล้ว → สร้าง user
  try {
    // ตรวจสอบว่า user มีอยู่แล้วไหม
    const existing = await knex('users').where({ phone }).first();
    if (existing) {
      return res.json({ message: 'Login successful', userId: existing.id });
    }

    // ถ้ายังไม่มี → insert ใหม่
    const newUser = {
      id: uuidv4(), // หรือ auto-increment แล้วแต่ schema
      username:'',
      email:'',
      phone : phone,
      password_hash: password_hash(password),
      created_at: new Date()
    };

    await knex('users').insert(newUser);
    console.log('🎉 Created user:', newUser);

    res.json({ message: 'User registered successfully', userId: newUser.id });

  } catch (err) {
    console.error('❌ Error creating user:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/register', async (req, res) => {
  const { phone } = req.body;

  // ✅ ตรวจสอบเบอร์ไทย (+66) และลาว (+856)
  const phoneRegex = /^(\+66\d{9}|\+856\d{8,9})$/;

  if (!phone || !phoneRegex.test(phone)) {
    return res.status(400).json({ error: 'Invalid phone number. Only +66 and +856 supported.' });
  }

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const key = `otp:${phone}`;

    await redisClient.set(key, otp, { EX: 300 }); // TTL 5 นาที
    const ip = utils.getClientIp(req);
    console.log(`📨 OTP for ${phone} (from ${ip}): ${otp}`);

    res.json({ message: 'OTP sent successfully (dev mode: check console)' });

  } catch (err) {
    console.error('❌ Error sending OTP:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});





module.exports = router;
