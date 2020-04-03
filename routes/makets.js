const express = require('express');
const router = express.Router();
const {
  getMaket,
  getMakets,
  createMaket,
  updateMaket,
  deleteMaket,
  maketImageUpload
} = require('../controllers/makets');
const Maket = require('../models/Maket');
const advancedResults = require('../middleware/advancedResults');
const { protect } = require('../middleware/auth');

router.route('/:id/image').put(protect, maketImageUpload);

router
  .route('/')
  .get(advancedResults(Maket), getMakets)
  .post(protect, createMaket);

router
  .route('/:id')
  .get(getMaket)
  .put(protect, updateMaket)
  .delete(protect, deleteMaket);

module.exports = router;
