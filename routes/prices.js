const express = require('express');
const router = express.Router({ mergeParams: true });
const Prices = require('../models/Prices');
const advancedResults = require('../middleware/advancedResults');
const {
  getPrices,
  getPrice,
  addPrices,
  updatePrices,
  deletePrices,
} = require('../controllers/prices');
const { protect, authorise } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(Prices, {
      path: 'maketid',
      select: 'maketname description',
    }),
    getPrices
  )
  .post(protect, authorise('admin'), addPrices);

router
  .route('/:id')
  .get(getPrice)
  .put(protect, authorise('admin'), updatePrices)
  .delete(protect, authorise('admin'), deletePrices);

module.exports = router;
