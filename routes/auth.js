const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  setRoleToUser,
  forgotPassword,
  resetPassword,
  updateProfile,
  updatePassword,
  logOut,
  updateUserAddress,
  updateUserPhone,
} = require('../controllers/auth');
const { protect, authorise } = require('../middleware/auth');

router
  .route('/register')
  .post(registerUser);
router
  .route('/login')
  .post(loginUser);
router
  .route('/me')
  .get(protect, getMe);
router
  .route('/updateprofile')
  .put(protect, updateProfile);
router
  .route('/updateprofileaddress')
  .put(protect, updateUserAddress);
router
  .route('/updateprofilephone')
  .put(protect, updateUserPhone);
router
  .route('/setrole/:id')
  .put(protect, authorise('owner'), setRoleToUser);
router
  .route('/forgotpassword')
  .post(forgotPassword);
router
  .route('/resetpassword/:resettoken')
  .put(resetPassword);
router
  .route('/updatepassword')
  .put(protect, updatePassword);
router
  .route('/logout')
  .get(protect, logOut);
  
module.exports = router;
