const express = require('express');
const router = express.Router();
const {
  getMaket,
  getMakets,
  createMaket,
  updateMaket,
  deleteMaket,
  maketImageUpload,
} = require('../controllers/makets');
const Maket = require('../models/Maket');
const reviewsRouter = require('./reviews');
const pricesRouter = require('./prices');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorise } = require('../middleware/auth');

router.use('/:maketid/reviews', reviewsRouter);
router.use('/:maketid/prices', pricesRouter);

router
  .route('/:id/image')
  .put(protect, authorise('admin', 'owner'), maketImageUpload);

router
  .route('/')
  .get(advancedResults(Maket), getMakets)
  .post(protect, authorise('admin', 'owner'), createMaket);

router
  .route('/:id')
  .get(getMaket)
  .put(protect, authorise('admin', 'owner'), updateMaket)
  .delete(protect, authorise('admin', 'owner'), deleteMaket);

module.exports = router;
