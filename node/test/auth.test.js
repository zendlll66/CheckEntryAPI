const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');

// 🧠 Memory store แทน Redis จริง
const store = {};

// ✅ Mock Redis client ทั้งระบบ
// jest.mock('../src/utils/redis', () => ({
//   redisClient: {
//     set: jest.fn((key, value, opts) => {
//       store[key] = value;
//       return Promise.resolve('OK');
//     }),
//     get: jest.fn((key) => Promise.resolve(store[key] || null)),
//     del: jest.fn((key) => {
//       delete store[key];
//       return Promise.resolve(1);
//     }),
//     ttl: jest.fn((key) => Promise.resolve(300))
//   },
//   connectRedisWithRetry: jest.fn()
// }));

// // ✅ Mock SMS service
// jest.mock('../src/utils/smsservice', () => ({
//   sendOtp: jest.fn()
// }));

// // ✅ Mock Knex DB สำหรับ register / login
// jest.mock('../src/db/connection', function () {
//   const mockUsers = [];

//   const knex = jest.fn((table) => {
//     if (table === 'users') {
//       return {
//         where: jest.fn(({ phone }) => ({
//           first: () => Promise.resolve(mockUsers.find(u => u.phone === phone))
//         })),
//         insert: jest.fn((user) => {
//           mockUsers.push(user);
//           return Promise.resolve([user]);
//         })
//       };
//     }
//     return {};
//   });

//   knex.__mockUsers = mockUsers;

//   return knex;
// });


// const { redisClient } = require('../src/utils/redis');
// const { sendOtp } = require('../src/utils/smsservice');
// const SECRET_KEY = process.env.JWT_SECRET || 'BANKBANKBANK';

// describe('Auth API', () => {
//   let token;

//   // 🧹 เคลียร์ Redis mock ก่อนแต่ละ test
//   beforeEach(() => {
//     for (const key in store) delete store[key];
//     jest.clearAllMocks();
//   });

//   describe('POST /api/auth/sendotp', () => {
//     it('should store OTP and call sendOtp', async () => {
//       const phone = '0987654321';
//       const res = await request(app)
//         .post('/api/auth/sendotp')
//         .send({ phone });

//       expect(res.statusCode).toBe(200);
//       expect(res.body).toHaveProperty('success', true);
//       expect(sendOtp).toHaveBeenCalled();
//       expect(redisClient.set).toHaveBeenCalledWith(
//         `otp:${phone}`,
//         expect.any(String),
//         { EX: 300 }
//       );
//     });

//     it('should fail with no phone', async () => {
//       const res = await request(app).post('/api/auth/sendotp').send({});
//       expect(res.statusCode).toBe(400);
//       expect(res.body).toHaveProperty('error');
//     });
//   });

//   describe('POST /api/auth/verifyotp', () => {
//     it('should verify correct OTP', async () => {
//       const phone = '0987654321';
//       const code = '123456';
//       await redisClient.set(`otp:${phone}`, code, { EX: 300 });

//       const res = await request(app)
//         .post('/api/auth/verifyotp')
//         .send({ phone, code });

//       expect(res.statusCode).toBe(200);
//       expect(res.body).toHaveProperty('message', expect.stringContaining('OTP verified'));
//     });

//     it('should reject invalid OTP', async () => {
//       await redisClient.set('otp:0987654321', '123456', { EX: 300 });

//       const res = await request(app)
//         .post('/api/auth/verifyotp')
//         .send({ phone: '0987654321', code: '999999' });

//       expect(res.statusCode).toBe(400);
//       expect(res.body).toHaveProperty('error');
//     });

//     it('should reject if OTP not found', async () => {
//       const res = await request(app)
//         .post('/api/auth/verifyotp')
//         .send({ phone: '0888888888', code: '000000' });

//       expect(res.statusCode).toBe(400);
//       expect(res.body).toHaveProperty('error');
//     });
//   });

//   describe('POST /api/auth/verifyotpandregister', () => {
//     it('should register new user if OTP matches and user does not exist', async () => {
//       const phone = '0888888888';
//       const otp = '123456';
//       const password = '0888888888';

//       await redisClient.set(`otp:${phone}`, otp, { EX: 300 });

//       const res = await request(app)
//         .post('/api/auth/verifyotpandregister')
//         .send({ phone, otp, password });

//       expect(res.statusCode).toBe(200);
//       expect(res.body).toHaveProperty('message', expect.stringContaining('registered'));
//       expect(res.body).toHaveProperty('userId');
//     });

//     it('should return login if user already exists', async () => {
//       const phone = '0987654321';
//       const otp = '123456';
//       const password = '0987654321';

//       await redisClient.set(`otp:${phone}`, otp, { EX: 300 });

//       // mock insert user ครั้งแรก (simulate registered user)
//       await request(app).post('/api/auth/verifyotpandregister').send({ phone, otp, password });

//       // ทดสอบ login อีกครั้ง
//       await redisClient.set(`otp:${phone}`, otp, { EX: 300 });

//       const res = await request(app)
//         .post('/api/auth/verifyotpandregister')
//         .send({ phone, otp, password });

//       expect(res.statusCode).toBe(200);
//       expect(res.body).toHaveProperty('message', expect.stringContaining('Login'));
//     });
//   });

//   describe('POST /api/auth/login', () => {
//     it('should return a valid JWT token', async () => {
//       const res = await request(app)
//         .post('/api/auth/login')
//         .send({ email: 'test@example.com', telno: '0123456789', password: '123456' });

//       expect(res.statusCode).toBe(200);
//       expect(res.body).toHaveProperty('token');

//       token = res.body.token;
//       const decoded = jwt.verify(token, SECRET_KEY);
//       expect(decoded).toHaveProperty('email', 'test@example.com');
//     });
//   });

//   describe('POST /api/auth/checkauthtoken', () => {
//     it('should verify a valid token', async () => {
//       const res = await request(app)
//         .post('/api/auth/checkauthtoken')
//         .send({ token });

//       expect(res.statusCode).toBe(200);
//       expect(res.body).toHaveProperty('email', 'test@example.com');
//     });

//     it('should reject an invalid token', async () => {
//       const res = await request(app)
//         .post('/api/auth/checkauthtoken')
//         .send({ token: 'bad.token.here' });

//       expect(res.statusCode).toBe(401);
//       expect(res.body).toHaveProperty('error');
//     });
//   });
// });
