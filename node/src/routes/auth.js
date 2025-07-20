require('dotenv').config();
const SECRET_KEY = process.env.JWT_SECRET || 'BANKBANKBANK';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { redisClient } = require('./../utils/redis');
const { sendOtp } = require('./../utils/smsservice');
const knex = require('../db/connection'); // เชื่อมกับ DB
const { v4: uuidv4 } = require('uuid');
const userModel = require('../models/user.model');
const authControllers = require('../controllers/authControllers');
const { password_hash, password_verify } = require('../utils/password');

// POST /api/login
router.post('/login', authControllers.login);
router.post('/register', authControllers.register);


router.post('/checkauthtoken', (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return res.status(200).json(decoded);

  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});







module.exports = router;
