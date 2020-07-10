const express = require('express');
const router = express.Router();
const advancedResults = require('../middleware/advancedResults');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/users');
const { protect, authorise } = require('../middleware/auth');
const User = require('../models/User');
router
  .use(protect);
router
  .use(authorise('admin', 'owner'));

router
  .route('/')
  .get(advancedResults(User), getUsers)
  .post(createUser);
router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);
  
module.exports = router;
