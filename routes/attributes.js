const express = require('express');
const router = express.Router();
const {
  getAttributes,
  createAttributes,
  updateAttributes,
  getAttributesById,
  deleteAttrGroup,
  addAttrGroup,
} = require('../controllers/attributes');
const Attributes = require('../models/Attributes');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorise } = require('../middleware/auth');

router.route('/').get(
  protect,
  authorise('admin', 'owner'),
  advancedResults(Attributes, {
    path: 'maketid',
    select: 'maketname',
  }),
  getAttributes
);

router
  .route('/:id')
  .get(protect, authorise('admin', 'owner'), getAttributesById)
  .post(protect, authorise('admin', 'owner'), createAttributes)
  .put(protect, authorise('admin', 'owner'), updateAttributes);

router
  .route('/group/:groupid')
  .post(protect, authorise('admin', 'owner'), deleteAttrGroup)
  .put(protect, authorise('admin', 'owner'), addAttrGroup);

module.exports = router;
