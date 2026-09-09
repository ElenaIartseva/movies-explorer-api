require('dotenv').config();

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb',
  NODE_ENV = 'development',
  JWT_SECRET,
  ALLOWED_ORIGINS = 'http://localhost:5173',
} = process.env;

const allowedOrigins = ALLOWED_ORIGINS.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOrigin = allowedOrigins.includes('*') ? true : allowedOrigins;

module.exports = {
  PORT,
  MONGO_URL,
  NODE_ENV,
  JWT_SECRET,
  corsOrigin,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 30,
  PASSWORD_MIN_LENGTH: 8,
  SALT_ROUNDS: 10,
  JWT_EXPIRES_IN: '7d',
};
