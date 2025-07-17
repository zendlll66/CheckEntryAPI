const bcrypt = require('bcrypt');

async function password_hash(password, saltRounds = 10) {
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

async function password_verify(plainPassword, hashedPassword) {
  const match = await bcrypt.compare(plainPassword, hashedPassword);
  return match; // true หรือ false
}

module.exports = {
  password_hash
  ,password_verify
};
