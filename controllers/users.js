const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((newUser) => res.status(201).send(newUser))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(500).send({ message: error.message });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
        })
        .send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

const getUser = (req, res) => User.find({})
  .then((users) => res.status(200).send(users))
  .catch((error) => res.status(500).send({ message: error.message }));

const getUserId = (req, res) => User.findById(req.params.id).then((item) => {
  if (!item) {
    return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
  }
  return res.status(200).send(item);
})
  .catch((error) => {
    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
    }
    return res.status(500).send({ message: error.message });
  });

const updateProfile = (req, res) => User
  .findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
  .then((item) => {
    if (!item) {
      return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
    }
    return res.status(200).send(item);
  })
  .catch((error) => {
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
    }
    return res.status(500).send({ message: error.message });
  });

const updateAvatar = (req, res) => User
  .findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
  .then((item) => {
    if (!item) {
      return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
    }
    return res.status(200).send(item);
  })
  .catch((error) => {
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
    }
    return res.status(500).send({ message: error.message });
  });

module.exports = {
  createUser,
  getUser,
  getUserId,
  updateProfile,
  updateAvatar,
  login,
};
