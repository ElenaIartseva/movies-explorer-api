const { verifyToken } = require('../utils/jwt');
const AuthorizationError = require('../errors/AuthorizationError');

function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthorizationError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');

  try {
    req.user = verifyToken(token);
  } catch {
    return next(new AuthorizationError('С токеном что-то не так'));
  }

  return next();
}

module.exports = { auth };
