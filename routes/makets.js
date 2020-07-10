const express = require('express');
const router = express.Router();
const {
  getMaket,
  getMaketBySlug,
  getMakets,
  createMaket,
  updateMaket,
  deleteMaket,
  maketImageUpload,
  getFileList,
} = require('../controllers/makets');
const Maket = require('../models/Maket');
const reviewsRouter = require('./reviews');
const pricesRouter = require('./prices');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorise } = require('../middleware/auth');

router.use('/:maketid/reviews', reviewsRouter);
router.use('/:maketid/prices', pricesRouter);

router
  .route('/image')
  .put(protect, authorise('admin', 'owner'), maketImageUpload);

router.route('/images').get(protect, authorise('admin', 'owner'), getFileList);
router
  .route('/')
  .get(
    advancedResults(
      Maket,
      {
        path: 'category',
        select: 'categoryname description',
      },
      {
        path: 'attributes',
        select:
          'attributes.scalesize attributes.w_netto attributes.w_bruto  attributes.height attributes.instock lastupdated',
      },
      {
        path: 'packing',
        select: 'name params',
      }
    ),
    getMakets
  )
  .post(protect, authorise('admin', 'owner'), createMaket);

router
  .route('/:id')
  .get(getMaket)
  .put(protect, authorise('admin', 'owner'), updateMaket)
  .delete(protect, authorise('admin', 'owner'), deleteMaket);
router.route('/slug/:slug').get(getMaketBySlug);

module.exports = router;
