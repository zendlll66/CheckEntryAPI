require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');
const amqp = require('amqplib');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6379';
const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://rabbitmq';

async function start() {
  // Redis setup
  const pubClient = createClient({ url: REDIS_URL });
  const subClient = pubClient.duplicate();
  await pubClient.connect();
  await subClient.connect();
  io.adapter(createAdapter(pubClient, subClient));

  // RabbitMQ setup
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();
  const queue = 'task_queue';
  await channel.assertQueue(queue, { durable: true });

  // Consume messages from RabbitMQ
  channel.consume(queue, (msg) => {
    if (msg !== null) {
      const content = msg.content.toString();
      console.log('Received from RabbitMQ:', content);

      // ตัวอย่าง: broadcast ข้อความจาก RabbitMQ ไปยัง Socket.IO client ทุกคน
      io.emit('rabbit_message', content);

      channel.ack(msg);
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join_room', (room) => {
      socket.join(room);
      console.log(`${socket.id} joined room ${room}`);
    });

    socket.on('send_message', (data) => {
      // ส่งข้อความไปใน room ผ่าน Socket.IO
      io.to(data.room).emit('message', { from: socket.id, msg: data.msg });
    });

    // ตัวอย่างส่งข้อความไป RabbitMQ queue
    socket.on('send_task', async (msg) => {
      await channel.sendToQueue(queue, Buffer.from(msg), { persistent: true });
      console.log('Sent to RabbitMQ:', msg);
    });
  });

  const PORT = 3000;
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start().catch(console.error);
