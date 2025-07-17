require('dotenv').config();

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken  = process.env.TWILIO_AUTH_TOKEN;
// const fromPhone  = process.env.TWILIO_PHONE_NUMBER;
// const serviceId  = process.env.TWILIO_VERIFY_SERVICE_SID;

// const twilio = require("twilio");

// const client = twilio(accountSid, authToken);

// async function sendOtp(toPhone) {
//   try {
//     const verification = await client.verify.v2.services(serviceId)
//       .verifications
//       .create({ to: toPhone, channel: 'sms' });
//     console.log('OTP sent status:', verification.status);
//   } catch (error) {
//     console.error('Error sending OTP:', error);
//   }
// }

// sendOtp('+66986629979');

const { io } = require('socket.io-client');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET||'BANKBANKBANK';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN||'1h';




function genToken(email)
{
  const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });
  return token;
}

const email = getRandomEmail();
let token = genToken(email);

// เชื่อมต่อกับเซิร์ฟเวอร์ และส่ง token ไปใน auth
//const webURL = 'ws://bstsoft.duckdns.org:19000';
const webURL = 'ws://localhost:19000';

const EARTH_RADIUS = 6371000; // in meters

let currentPosition = { lat: 13.7563, lng: 100.5018 };

const socket = io(webURL, {
  auth: {
    token: token
  },  
  transports: ['websocket'], 
  timeout: 5000,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000
});

console.log("try to connect");

// เมื่อเชื่อมต่อสำเร็จ
socket.on('connect', () => {
  console.log('✅ Connected to server');
  startSendMessage();
});

// รับข้อความจาก server
socket.on('message', (msg) => {
  console.log('📩 Received message:', msg);
});

// จัดการ error
socket.on('connect_error', (err) => {
  console.error('❌ Connection Error:', err.message);
});

// Disconnect
socket.on('disconnect', (reason) => {
  console.log('❌ Disconnected from server. Reason:', reason);
});


function startSendMessage()
{
    // เริ่ม interval ส่งข้อความทุก 10 วินาที
    setInterval(() => {
    // ขยับจุด
    currentPosition = moveLatLng(currentPosition.lat * Math.PI / 180, currentPosition.lng * Math.PI / 180);

    const randomMessage = getRandomMessage();
    const payload = {
      message: randomMessage,
      email: email,
      lat: currentPosition.lat,
      lng: currentPosition.lng
    };

    socket.emit('chat-message', payload);
    console.log('📤 Sent:', payload);
  }, 10_000);
}

// ฟังก์ชันสุ่มข้อความ
function getRandomMessage() {
  const messages = [
    'สวัสดีครับ',
    'วันนี้อากาศดีจัง',
    'มีใครอยู่ไหม?',
    'ส่งข้อความทดสอบ',
    'Node.js แจ่มมาก!',
    'Socket.IO ทำงานดีนะ',
    'กินข้าวหรือยัง?',
    'ทดสอบๆๆๆ',
    'มีบั๊กอีกแล้วแฮะ',
    'ส่งจากฝั่ง Client ครับ'
  ];
  const index = Math.floor(Math.random() * messages.length);
  return messages[index];
}

function getRandomEmail() {
  const names = [
    'alice', 'bob', 'charlie', 'dave', 'eve',
    'frank', 'grace', 'heidi', 'ivan', 'judy',
    'karen', 'leo', 'mike', 'nancy', 'oliver',
    'peggy', 'quinn', 'rachel', 'sam', 'trudy',
    'ursula', 'victor', 'wendy', 'xavier', 'yasmine',
    'zack', 'brian', 'chloe', 'diana', 'ethan'
  ];

  const domains = ['example.com', 'test.com', 'mail.com', 'demo.org', 'fakemail.net'];

  const name = names[Math.floor(Math.random() * names.length)];
  const number = Math.floor(Math.random() * 1000); // เพิ่มความ unique
  const domain = domains[Math.floor(Math.random() * domains.length)];

  return `${name}${number}@${domain}`;
}



function moveLatLng(lat, lng, distanceMeters = 30) {
  
  const bearing = Math.random() * 2 * Math.PI; // สุ่มทิศทาง (0–2π เรเดียน)
  const delta = distanceMeters / EARTH_RADIUS;

  const newLat = Math.asin(
    Math.sin(lat) * Math.cos(delta) +
    Math.cos(lat) * Math.sin(delta) * Math.cos(bearing)
  );

  const newLng = lng + Math.atan2(
    Math.sin(bearing) * Math.sin(delta) * Math.cos(lat),
    Math.cos(delta) - Math.sin(lat) * Math.sin(newLat)
  );
  
  return {
    lat: newLat * 180 / Math.PI,
    lng: newLng * 180 / Math.PI
  };
}
