const Card = require('../models/card');

// errors
const ValidationError = require('../errors/ValidationError'); // 400
const ForbiddenError = require('../errors/ForbiddenError'); // 403
const NotFoundError = require('../errors/NotFoundError'); // 404

// Создать карточку
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // res.status(400).send({ message: 'Одно из полей не заполнены корректно' });
        return next(new ValidationError('Одно из полей не заполнены корректно'));
      }
      return next(err);
    });
};

// Возвратить все карточки
const getCards = (_, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

// Удалить карточку
const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user._id;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с таким ID не найдена');
      }
      if (!card.owner.equals(owner)) {
        return next(new ForbiddenError('Нельзя удалить чужую карточку'));
      }
      return Card.findByIdAndRemove(cardId)
        .then(() => res.status(200).send({ message: 'Карточка удалена' }))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Не корректный ID карточки'));
      }
      return next(err);
    });
};

// Поставить лайк карточке
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).then((card) => {
    if (!card) {
      throw new NotFoundError('Карточка с таким ID не найдена');
    }
    res.status(200).send(card);
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Не корректный ID карточки'));
      }
      return next(err);
    });
};

// Убрать лайки с карточки
const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  ).then((card) => {
    if (!card) {
      throw new NotFoundError('Карточка с таким ID не найдена');
    }
    res.status(200).send(card);
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Не корректный ID карточки'));
      }
      return next(err);
    });
};

module.exports = {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
};
