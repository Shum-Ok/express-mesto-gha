const router = require('express').Router();
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
router.get('/:userId', getUser);

// Обновить профиль Юзера
router.patch('/me', patchUser);

// обновить аватар
router.patch('/me/avatar', patchUserAvatar);

module.exports.userRouter = router;
