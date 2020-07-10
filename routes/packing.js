const express = require('express');
const router = express.Router();
const {
  getPacking,
  createPacking,
  getPackingById,
  updatePacking,
  deletePacking,
} = require('../controllers/packing');
const Packing = require('../models/Packing');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorise } = require('../middleware/auth');

router
  .route('/')
  .get(
    protect,
    authorise('admin', 'owner'),
    advancedResults(Packing),
    getPacking
  )
  .post(protect, authorise('admin', 'owner'), createPacking);

router
  .route('/:id')
  .get(protect, authorise('admin', 'owner'), getPackingById)
  .put(protect, authorise('admin', 'owner'), updatePacking)
  .delete(protect, authorise('admin', 'owner'), deletePacking);

module.exports = router;
