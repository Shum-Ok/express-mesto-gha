const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET, NODE_ENV } = process.env;

// errors
const ValidationError = require('../errors/ValidationError'); // 400
const UnauthorizedError = require('../errors/UnauthorizedError'); // 401
const NotFoundError = require('../errors/NotFoundError'); // 404
const ConflictError = require('../errors/ConflictError'); // 409

const MONGO_DUPLICATE_KEY_CODE = 11000;

// salt
const saltRounds = 10;

// Регистрация пользователя
const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  return bcrypt.hash(password, saltRounds)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      })
        .then(() => {
          res.status(200).send({
            email,
            name,
            about,
            avatar,
          });
        })
        .catch((err) => {
          if (err.code === MONGO_DUPLICATE_KEY_CODE) {
            next(new ConflictError(`Емайл ${err.keyValue.email} уже занят`));
          }
          next(err);
        });
    });
};

// авторизация пользователя
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна
      const token = jwt.sign({ _id: user._id }, `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`, { expiresIn: '7d' }); // создали токен
      res.status(200).send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('Неверные логин или пароль'));
    });
};

// Вернуть одного юзера GET
const getUser = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с таким ID не найден');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Не корректный ID пользователя'));
      }
      return next(err);
    });
};

// Вернуть всех юзеров GET
const getUsers = (_, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

// Получить свои данные
const getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

// Обновить профиль Юзера PATCH
const patchUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch(next);
};

// Обновить аватар Юзера PATCH
const patchUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(200).send(user))
    .catch(next);
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  patchUser,
  patchUserAvatar,
  login,
  getUserMe,
};
