require('dotenv').config();
const amqp = require('amqplib');

const rabbitmqURL = process.env.RABBITMQ_URL || 'amqp://rabbitmq';
let channel = null;

async function connectRabbitWithRetry(maxRetries = 10) {
  for (let i = 1; i <= maxRetries; i++) {
    try {
      const connection = await amqp.connect(rabbitmqURL);
      channel = await connection.createChannel();
      await channel.assertQueue('bid_queue', { durable: true });
      console.log('✅ Connected to RabbitMQ');
      return channel;
    } catch (err) {
      console.warn(`🔁 Retry ${i}/${maxRetries} connecting to RabbitMQ...`);
      await new Promise(res => setTimeout(res, 2000));
    }
  }
  throw new Error('❌ Failed to connect to RabbitMQ after retries');
}

function getChannel() {
  if (!channel) {
    throw new Error('RabbitMQ channel is not initialized. Please call connectRabbitWithRetry() first.');
  }
  return channel;
}

module.exports = {
  connectRabbitWithRetry,
  getChannel,
};
