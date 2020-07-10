const express = require('express');
const router = express.Router();
const {
  createBasket,
  getBasket,
  getBaskets,
  deleteBasket,
  updateBasket,
  checkBasketExists,
  countBasketItems,
  deleteRow,
} = require('../controllers/basket');
const Basket = require('../models/Basket');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorise } = require('../middleware/auth');

router
  .route('/')
  .get(advancedResults(Basket), protect, authorise('user', 'admin'), getBaskets)
  .post(protect, authorise('user', 'admin'), createBasket);
router.route('/row/:id').put(protect, authorise('user', 'admin'), deleteRow);
router
  .route('/count/:id')
  .get(protect, authorise('admin', 'user'), countBasketItems);
router
  .route('/check/:customerid')
  .get(protect, authorise('admin', 'user'), checkBasketExists);

router
  .route('/:id')
  .put(protect, authorise('user', 'admin'), updateBasket)
  .get(protect, authorise('user', 'admin'), getBasket)
  .delete(protect, authorise('user', 'admin'), deleteBasket);
module.exports = router;
