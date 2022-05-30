const router = require('express').Router();
const {
  createUser,
  getUsers,
  getUser,
  patchUser,
  patchUserAvatar,
} = require('../controllers/users');

// Создать Юзера
router.post('/', createUser);

// Получить Юзера по id
router.get('/:userId', getUser);

// Получить всех юзеров
router.get('/', getUsers);

// Обновить профиль Юзера
router.patch('/me', patchUser);

// обновить аватар
router.patch('/me/avatar', patchUserAvatar);

module.exports.userRouter = router;
