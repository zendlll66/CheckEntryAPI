const ioClient = require('socket.io-client');
const jwt = require('jsonwebtoken');
const { startServer, server } = require('../src/server'); // เปลี่ยน path ให้ตรง

const SECRET_KEY = process.env.JWT_SECRET || 'BANKBANKBANK';
const PORT = process.env.PORT || '3000'
const SOCKET_URL = `http://localhost:${PORT}`;

// describe('WebSocket Auth', () => {
//   let httpServer;
//   let clientSocket;

//   beforeAll(async () => {
//     httpServer = await startServer(); // เรียก async ที่เรา control เอง
//   });

//   afterAll((done) => {
//     httpServer.close(done); // ปิดให้ถูกต้อง
//   });

//   afterEach(() => {
//     if (clientSocket?.connected) clientSocket.disconnect();
//   });

//   it('should reject connection without token', (done) => {
//     clientSocket = ioClient(SOCKET_URL, {
//       auth: {}
//     });

//     clientSocket.on('connect_error', (err) => {
//       expect(err.message).toBe('Authentication error: Token missing');
//       done();
//     });
//   });

//   it('should connect with valid token', (done) => {
//     const token = jwt.sign({ id: 'test123' }, SECRET_KEY, { expiresIn: '1h' });

//     clientSocket = ioClient(SOCKET_URL, {
//       auth: { token }
//     });

//     clientSocket.on('connect', () => {
//       expect(clientSocket.connected).toBe(true);
//       done();
//     });
//   });
// });
