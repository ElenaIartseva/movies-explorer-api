const routerSignin = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login } = require('../controllers/users');
const { PASSWORD_MIN_LENGTH } = require('../utils/config');

routerSignin.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(PASSWORD_MIN_LENGTH),
    }),
  }),
  login
);

module.exports = routerSignin;
