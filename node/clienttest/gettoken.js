require('dotenv').config();
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET||'BANKBANKBANK';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN||'1h';

function genToken(email)
{
    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: JWT_EXPIRES_IN });
    return token;
}

const email = "prem@gmail.com";
let token = genToken(email);

console.log(token);