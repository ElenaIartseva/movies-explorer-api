const userRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUserMe, updateUser } = require('../controllers/users');
const { NAME_MIN_LENGTH, NAME_MAX_LENGTH } = require('../utils/config');

userRoutes.get('/me', getUserMe);

userRoutes.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(NAME_MIN_LENGTH).max(NAME_MAX_LENGTH).required(),
      email: Joi.string().required().email(),
    }),
  }),
  updateUser
);

module.exports = userRoutes;
