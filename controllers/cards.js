const Card = require('../models/card');

// Создать карточку
const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  if (!name || !link) {
    return res.status(400).send({ message: 'Одно из полей не заполнены' });
  }

  return Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Одно из полей не заполнены корректно' });
      }
      return res.status(500).send({ message: 'Серверная ошибка' });
    });
};

// Возвратить все карточки
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(500).send({ message: 'Серверная ошибка' }));
};

// Удалить карточку
const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (card === null) {
        return res.status(404).send({ message: 'Карточки с таким id не найдено' });
      }
      return res.status(200).send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы не корректные данные' });
      }
      return res.status(500).send({ message: 'Произошла ошибка сервера' });
    });
};

// Поставить лайк карточке
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).then((card) => {
    if (card === null) {
      return res.status(404).send({ message: 'Карточки с таким id не найдено' });
    }
    return res.status(200).send(card);
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Не корректный id карточки' });
      }
      return res.status(500).send({ message: 'Серверная ошибка' });
    });
};

// Убрать лайки с карточки
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).then((card) => {
    if (card === null) {
      return res.status(404).send({ message: 'Карточки с таким id не найдено' });
    }
    return res.status(200).send(card);
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Не корректный id карточки' });
      }
      return res.status(500).send({ message: 'Серверная ошибка' });
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
