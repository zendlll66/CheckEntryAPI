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

router.post('/register', async (req, res) => {
  const { phone } = req.body;

  // ✅ ตรวจสอบเบอร์ไทย (+66) และลาว (+856)
  const phoneRegex = /^(\d{9})$/;

  if (!phone || !phoneRegex.test(phone)) {
    return res.status(400).json({ error: 'Invalid phone number.' });
  }

  try {
    
    res.json({ message: 'OTP sent successfully (dev mode: check console)' });

  } catch (err) {
    console.error('❌ Error sending OTP:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});





module.exports = router;
