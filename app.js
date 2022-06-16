const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const error = require('./middlewares/error');

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

const { PORT = 3000 } = process.env;

app.use(express.json());

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth); // авторизация

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('/', (_, res) => {
  res.status(404).send({ message: 'Страница с таким url не найдена' });
});

app.use(errors()); // обработчик ошибок celebrate

app.use(error); // мой обработчий ошибок

app.listen(PORT);
