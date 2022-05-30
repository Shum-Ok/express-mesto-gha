const User = require('../models/user');

// Создать юзера
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  if (!name || !about) {
    return res.status(400).send({ message: 'Одно из полей не заполнены' });
  }

  return User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Одно из полей не заполнены корректно' });
      }
      return res.status(500).send({ message: 'Серверная ошибка' });
    });
};

// Вернуть одного юзера
const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Юзер не найден' });
      }

      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(400).send({ message: 'Не корректный ID пользователя' });
      }
      return res.status(500).send({ message: 'Серверная ошибка' });
    });
};

// Вернуть всех юзеров
const getUsers = (_, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send({ message: 'Серверная ошибка' }));
};

// Обновить профиль Юзера
const patchUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Юзер с таким ID не найден' });
      }

      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(400).send({ message: 'Не корректный ID пользователя' });
      }
      return res.status(500).send({ message: 'Серверная ошибка' });
    });
};

// Обновить аватар Юзера
const patchUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Юзер с таким ID не найден' });
      }

      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(400).send({ message: 'Не корректный ID пользователя' });
      }
      return res.status(500).send({ message: 'Серверная ошибка' });
    });
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  patchUser,
  patchUserAvatar,
};
