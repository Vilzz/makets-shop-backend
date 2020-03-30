const express = require('express');
const router = express.Router();
const {
  getMaket,
  getMakets,
  createMaket,
  updateMaket,
  deleteMaket
} = require('../controllers/makets');

router
  .route('/')
  .get(getMakets)
  .post(createMaket);

router
  .route('/:id')
  .get(getMaket)
  .put(updateMaket)
  .delete(deleteMaket);

module.exports = router;
