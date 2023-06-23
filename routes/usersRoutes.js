const router = require('express').Router();
const {
  getUser, getUserId, updateProfile, updateAvatar,
} = require('../controllers/users');

// router.post('/', createUser);
router.get('/', getUser);
router.get('/:id', getUserId);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
