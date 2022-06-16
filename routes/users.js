const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { regExpUrl } = require('../utils/const');

const {
  getUsers,
  getUser,
  patchUser,
  patchUserAvatar,
  getUserMe,
} = require('../controllers/users');

// Получить всех юзеров
router.get('/', getUsers);

// Получить свои данные
router.get('/me', getUserMe);

// Получить Юзера по id
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24).hex(),
  }),
}), getUser);

// Обновить профиль Юзера
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), patchUser);

// обновить аватар
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(regExpUrl),
  }),
}), patchUserAvatar);

module.exports.userRouter = router;
