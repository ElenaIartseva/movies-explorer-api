const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET, JWT_EXPIRES_IN } = require('./config');

const DEV_SECRET = 'dev-secret-key';

function getJwtSecret() {
  if (NODE_ENV === 'production') {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is required in production');
    }
    return JWT_SECRET;
  }

  return JWT_SECRET || DEV_SECRET;
}

function signToken(payload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });
}

function verifyToken(token) {
  return jwt.verify(token, getJwtSecret());
}

module.exports = {
  getJwtSecret,
  signToken,
  verifyToken,
};
