const User = require('../models/userSchema');

const createUser = (req, res) => User
  .create(req.body)
  .then((newUser) => res.status(201).send(newUser))
  .catch((error) => {
    if (error.name === 'ValidationError') {
      return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
    }
    return res.status(500).send({ message: error.message });
  });

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
};
