const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/users');
const { signToken } = require('../utils/jwt');
const { SALT_ROUNDS } = require('../utils/config');
const ReRegistrationError = require('../errors/ReRegistrationError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const AuthorizationError = require('../errors/AuthorizationError');

function toUserResponse(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
  };
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = signToken({ _id: user._id });

    return res.send({
      jwt: token,
      ...toUserResponse(user),
    });
  } catch (err) {
    if (err.name === 'AuthorizationError') {
      return next(new AuthorizationError('Неправильные почта или пароль'));
    }
    return next(err);
  }
};

const createUsers = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      email,
      password: hash,
      name,
    });

    return res.status(201).send({
      user: toUserResponse(user),
    });
  } catch (err) {
    if (err.code === 11000) {
      return next(new ReRegistrationError('Данный email уже зарегистрирован'));
    }
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new ValidationError('Переданы некорректные данные'));
    }
    return next(err);
  }
};

const getUserMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    }
    return res.send(toUserResponse(user));
  } catch (err) {
    return next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      throw new NotFoundError('Пользователь с указанным _id не найден');
    }
    return res.send(toUserResponse(user));
  } catch (err) {
    if (err.code === 11000) {
      return next(new ReRegistrationError('Данный email уже зарегистрирован'));
    }
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new ValidationError('Переданы некорректные данные'));
    }
    return next(err);
  }
};

module.exports = {
  login,
  getUserMe,
  createUsers,
  updateUser,
};
