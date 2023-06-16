const router = require('express').Router();
const {
  getCards, createCards, deleteCards, putLike, deleteLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCards);
router.delete('/:cardId', deleteCards);
router.put('/:cardId/likes', putLike);
router.delete('/:cardId/likes', deleteLike);

module.exports = router;
