const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  setRoleToUser,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth');
const { protect, authorise } = require('../middleware/auth');

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/me').get(protect, getMe);
router.route('/:id').put(protect, authorise('owner'), setRoleToUser);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:resettoken').put(resetPassword);
module.exports = router;
