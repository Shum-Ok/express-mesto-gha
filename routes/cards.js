const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// Создать карточку
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
  }),
}), createCard);

// Получить все карточки
router.get('/', getCards);

// Удалить карточку
router.delete('/:cardId', deleteCard);

// Поставить лайк карточке
router.put('/:cardId/likes', likeCard);

// Убрать лайки с карточки
router.delete('/:cardId/likes', dislikeCard);

module.exports.cardRouter = router;
