const jwt = require('jsonwebtoken');

// errors
const UnauthorizedError = require('../errors/UnauthorizedError'); // 401

module.exports = (req, res, next) => {
  // Достаем авторизованный заголовок
  const { authorization } = req.headers;

  // проверяем, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    // return res.status(401).send({ message: 'Необходима авторизоваться' });
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
    // return res.status(401).send({ message: 'Необходима авторизоваться' });
    return next(new UnauthorizedError('Необходима авторизоваться'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
