const express = require('express');
const { errors, celebrate, Joi } = require('celebrate');
const mongoose = require('mongoose');
const auth = require('./middlewares/auth');

const app = express();

const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;
app.use(express.json());

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
    autoIndex: true,
  })
  .then(() => {
    console.log('success');
  })
  .catch(() => {
    console.log('fail');
  });

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(https?):\/\/[^\s$.?#].[^\s]*$/),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(https?):\/\/[^\s$.?#].[^\s]*$/),
  }),
}), createUser);

app.use('/users', auth, require('./routes/usersRoutes'));
app.use('/cards', auth, require('./routes/cardsRoutes'));

app.use(errors());

app.use((error, req, res, next) => {
  const { statusCode = 500, message } = error;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.use('/*', (req, res, next) => {
  res.status(404).send({ message: 'Страница не найдена.' });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
