const express = require('express');
const mongoose = require('mongoose');
const { errors, celebrate, Joi } = require('celebrate');

const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const error = require('./middlewares/error');

const NotFoundError = require('./errors/NotFoundError');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

const { PORT = 3000 } = process.env;

app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
  }),
}), createUser);

app.use(auth); // авторизация

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use('/', (_, res, next) => {
  next(new NotFoundError('Такой URL не найден'));
});

app.use(errors()); // обработчик ошибок celebrate

app.use(error); // мой обработчий ошибок

app.listen(PORT);
