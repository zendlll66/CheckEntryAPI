require('dotenv').config();
const { createClient } = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter');

const redisURL = process.env.REDIS_URL || 'redis://redis:6379';

const redisClient = createClient({ url: redisURL });

async function connectRedisWithRetry(maxRetries = 10) {
  for (let i = 1; i <= maxRetries; i++) {
    try {
      if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log('✅ Connected to Redis');
      }
      return redisClient;
    } catch (err) {
      console.warn(`🔁 Retry ${i}/${maxRetries} connecting to Redis...`);
      await new Promise(res => setTimeout(res, 2000));
    }
  }
  throw new Error('❌ Failed to connect to Redis after retries');
}

async function setupSocketRedisAdapter(io) {
  const pubClient = createClient({ url: redisURL });
  const subClient = pubClient.duplicate();

  await pubClient.connect();
  await subClient.connect();

  io.adapter(createAdapter(pubClient, subClient));
}

module.exports = {
  redisClient,
  connectRedisWithRetry,
  setupSocketRedisAdapter,
};
