// test/util-password.test.js
const { password_hash, password_verify } = require('../src/utils/password');

// describe('Password Hashing Utility', () => {
//   const plainPassword = 'mySecret123';

//   it('should hash a password and return a string', async () => {
//     const hashed = await password_hash(plainPassword);
//     expect(typeof hashed).toBe('string');
//     expect(hashed).not.toBe(plainPassword);
//   });

//   it('should return true when password matches hash', async () => {
//     const hashed = await password_hash(plainPassword);
//     const match = await password_verify(plainPassword, hashed);
//     expect(match).toBe(true);
//   });

//   it('should return false when password does not match hash', async () => {
//     const hashed = await password_hash(plainPassword);
//     const match = await password_verify('wrongPassword', hashed);
//     expect(match).toBe(false);
//   });
// });
