const express = require('express');
const router = express.Router();
const { protect, authorise } = require('../middleware/auth');

const {
  createContact,
  updateContact,
  getContact,
} = require('../controllers/contact');

router.route('/').post(protect, authorise('admin', 'owner'), createContact);

router
  .route('/:id')
  .get(getContact)
  .put(protect, authorise('admin', 'owner'), updateContact);

module.exports = router;
