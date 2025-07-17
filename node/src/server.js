// server.js
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const path = require('path');

const app = require('./app');
const { redisClient, connectRedisWithRetry, setupSocketRedisAdapter } = require('./utils/redis');
const { connectRabbitWithRetry } = require('./utils/rabbitmq');

const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.JWT_SECRET || 'BANKBANKBANK';

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

let channel;

// Middleware ตรวจสอบ JWT และเก็บ user ไว้ที่ socket.user
// io.use((socket, next) => {
//   const token = socket.handshake.auth.token || socket.handshake.headers['authorization']?.split(' ')[1];
//   console.log("token",token);
//   if (!token) return next(new Error('Authentication error: Token missing'));

//   jwt.verify(token, SECRET_KEY, (err, decoded) => {
//     if (err) return next(new Error('Authentication error: Token invalid'));
//     socket.user = decoded;
//     console.log('User authenticated:', socket.user);
//     next();
//   });
// });

// เมื่อ client เชื่อมต่อสำเร็จ
// io.on('connection', (socket) => {
//   console.log('User connected:', socket.user.email);

//   socket.on('chat-message', (data) => {
//     console.log(`💬 From ${data.email}: ${data.message}`);

//     // Broadcast ข้อความไปยัง client ทุกคน ยกเว้นคนส่ง
//     socket.broadcast.emit('message', JSON.stringify(data) );
//   });

//   socket.on('disconnect', (reason) => {
//     console.log('❌ Disconnected:', socket.user.email, 'Reason:', reason);
//   });
// });

// ฟังก์ชันเริ่มต้น server พร้อมเชื่อม Redis และ RabbitMQ
async function startServer() {
  // เชื่อม Redis client ทั่วไป (สำหรับงานอื่น ๆ ในโปรเจกต์)
  //await connectRedisWithRetry();

  // เชื่อม Redis Adapter ให้ Socket.IO ใช้งาน pub/sub ข้าม instance ได้
  //await setupSocketRedisAdapter(io);

  // เชื่อม RabbitMQ (ตามที่คุณมี)
  //channel = await connectRabbitWithRetry();

  return new Promise((resolve) => {
    const instance = server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      resolve(instance);
    });
  });
}

module.exports = { server, startServer, io };
