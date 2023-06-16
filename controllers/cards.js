const Card = require('../models/cardSchema');

const getCards = (req, res) => Card.find({}).populate('owner')
  .then((card) => res.status(200).send(card))
  .catch((error) => res.status(500).send({ message: error.message }));

const createCards = (req, res) => {
  const { name, link } = req.body;
  return Card.create({ name, link, owner: req.user._id })
    .then((newCard) => res.status(201).send(newCard))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(500).send({ message: error.message });
    });
};

const deleteCards = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndDelete(cardId).then((card) => {
    if (!card) {
      return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
    }
    return res.status(200).send(card);
  })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(500).send({ message: error.message });
    });
};

const putLike = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
).then((card) => {
  if (!card) {
    return res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
  }
  return res.status(200).send(card);
})
  .catch((error) => {
    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
    }
    return res.status(500).send({ message: error.message });
  });

const deleteLike = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
).then((card) => {
  if (!card) {
    return res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
  }
  return res.status(200).send(card);
})
  .catch((error) => {
    if (error.name === 'CastError') {
      return res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
    }
    return res.status(500).send({ message: error.message });
  });

module.exports = {
  getCards,
  createCards,
  deleteCards,
  putLike,
  deleteLike,
};
