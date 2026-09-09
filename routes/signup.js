const routerSignup = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUsers } = require('../controllers/users');
const {
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} = require('../utils/config');

routerSignup.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(PASSWORD_MIN_LENGTH),
      name: Joi.string().min(NAME_MIN_LENGTH).max(NAME_MAX_LENGTH).required(),
    }),
  }),
  createUsers
);

module.exports = routerSignup;
