const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const validator = require('validator');
const AuthorizationError = require('../errors/AuthorizationError');
const { NAME_MIN_LENGTH, NAME_MAX_LENGTH } = require('../utils/config');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: 'Некорректный email',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: true,
      minlength: NAME_MIN_LENGTH,
      maxlength: NAME_MAX_LENGTH,
    },
  },
  { toObject: { useProjection: true }, toJSON: { useProjection: true } }
);

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new AuthorizationError('Неправильные почта или пароль')
        );
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new AuthorizationError('Неправильные почта или пароль')
          );
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
