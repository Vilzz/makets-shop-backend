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

router.route('/:id/image').put(maketImageUpload);

router
  .route('/')
  .get(advancedResults(Maket), getMakets)
  .post(createMaket);

router
  .route('/:id')
  .get(getMaket)
  .put(updateMaket)
  .delete(deleteMaket);

module.exports = router;
