const mongoose = require('mongoose');
const Movie = require('../models/movie');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');

const getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id });
    return res.send(movies);
  } catch (err) {
    return next(err);
  }
};

const createMovie = async (req, res, next) => {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      nameRU,
      nameEN,
      movieId,
    } = req.body;

    const movie = await Movie.create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner: req.user._id,
      nameRU,
      nameEN,
      movieId,
    });

    return res.status(201).send(movie);
  } catch (err) {
    if (err.code === 11000) {
      return next(new ConflictError('Фильм уже сохранён'));
    }
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new ValidationError('Переданы некорректные данные'));
    }
    return next(err);
  }
};

const deleteMovie = async (req, res, next) => {
  const { _id } = req.params;
  const userId = req.user._id;

  try {
    const movie = await Movie.findById(_id).orFail();

    if (movie.owner.toString() !== userId) {
      throw new ForbiddenError(
        'Невозможно удалить карточку, созданную другим пользователем'
      );
    }

    const movieData = await movie.deleteOne();
    return res.send(movieData);
  } catch (err) {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      return next(new NotFoundError(`Передан несуществующий _id: ${_id}`));
    }
    if (err instanceof mongoose.Error.CastError) {
      return next(new ValidationError('Переданы некорректные данные'));
    }
    return next(err);
  }
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
