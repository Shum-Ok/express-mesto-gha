const router = require('express').Router();
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// Создать карточку
router.post('/', createCard);

// Получить все карточки
router.get('/', getCards);

// Удалить карточку
router.delete('/:cardId', deleteCard);

// Поставить лайк карточке
router.put('/:cardId/likes', likeCard);

// Убрать лайки с карточки
router.delete('/:cardId/likes', dislikeCard);

module.exports.cardRouter = router;
