require('dotenv').config();

const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { router } = require('./routes/index');
const limiter = require('./middlewares/rateLimiter');
const { errorHandler } = require('./middlewares/errorHandler');
const { corsOrigin, NODE_ENV } = require('./utils/config');

const app = express();
const isTest = NODE_ENV === 'test';

app.use(
  cors({
    origin: corsOrigin,
  })
);
app.use(helmet());

if (!isTest) {
  app.use(limiter);
}

app.use(express.json());

if (!isTest) {
  app.use(requestLogger);
}

app.use(router);

if (!isTest) {
  app.use(errorLogger);
}

app.use(errors());
app.use(errorHandler);

module.exports = app;
