
function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0]; 
  }

  return req.socket?.remoteAddress || null;
}

module.exports = { getClientIp };
