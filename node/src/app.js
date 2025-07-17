require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET || 'BANKBANKBANK';

const path = require('path');
const express = require('express');
const utils = require('./utils/ipaddress');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();

// ตั้งค่า view engine เป็น ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/', async (req, res) => {    
  const ip = utils.getClientIp(req);
  console.log("Get from :", ip)
  res.json({ message: "Get server", ip });
});

// เพิ่ม route สำหรับหน้า websclient
app.get('/websclient', (req, res) => {  
  try {
    res.render('websclient');
  } catch (error) {
    res.send(error);
  }
  
});

app.get('/websclientwithmap', (req, res) => {  
  try {
    res.render('websclientwithmap');
  } catch (error) {
    res.send(error);
  }
});

module.exports = app;
