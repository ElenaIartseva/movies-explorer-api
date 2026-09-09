const movieRoutes = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { URL_REGEX } = require('../utils/constants');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

movieRoutes.get('/', getMovies);

movieRoutes.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().pattern(URL_REGEX).required(),
      trailerLink: Joi.string().pattern(URL_REGEX).required(),
      thumbnail: Joi.string().pattern(URL_REGEX).required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
      movieId: Joi.number().required(),
    }),
  }),
  createMovie
);

movieRoutes.delete(
  '/:_id',
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteMovie
);

module.exports = movieRoutes;
