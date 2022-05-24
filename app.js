const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Поля схемы пользователя:
// name — имя пользователя, строка от 2 до 30 символов, обязательное поле;
// about — информация о пользователе, строка от 2 до 30 символов, обязательное поле;
// avatar — ссылка на аватарку, строка, обязательное поле.
// В следующем спринте вы напишите собственное решение для валидации этого поля.
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model('user', userSchema);

// Поля схемы карточки:
// name — имя карточки, строка от 2 до 30 символов, обязательное поле;
// link — ссылка на картинку, строка, обязательно поле.
// owner — ссылка на модель автора карточки, тип ObjectId, обязательное поле;
// likes — список лайкнувших пост пользователей, массив ObjectId,
// по умолчанию — пустой массив (поле default);
// createdAt — дата создания, тип Date, значение по умолчанию Date.now.
// подключаемся к серверу mongo
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: Object,
    required: true,
  },
  like: {
    default: [{}],
  },
  createdAt: {
    type: Date,
    required: Date.now,
  },
});
module.exports = mongoose.model('card', cardSchema);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const { PORT = 3000 } = process.env;

app.listen(PORT);
