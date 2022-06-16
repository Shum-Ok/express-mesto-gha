const jwt = require('jsonwebtoken');

// errors
const UnauthorizedError = require('../errors/UnauthorizedError'); // 401

module.exports = (req, _, next) => {
  // Достаем авторизованный заголовок
  const { authorization } = req.headers;

  // проверяем, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизоваться');
  }

  // извлечем токен
  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    // пробуем верифицировать токен
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    // отправляем ошибку если не получилось
    next(new UnauthorizedError('Необходима авторизоваться'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
