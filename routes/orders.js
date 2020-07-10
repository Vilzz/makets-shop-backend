const express = require('express');
const router = express.Router();

const {
  createOrder,
  getOrders,
  getOrderDetails,
  updateOrderStatus,
} = require('../controllers/orders');
const Order = require('../models/Orders');
const Maket = require('../models/Maket');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorise } = require('../middleware/auth');

router
  .route('/')
  .get(
    protect,
    authorise('user', 'admin', 'owner'),
    advancedResults(
      Order,
      {
        path: 'items.item',
        select: 'maketname ',
      },
      {
        path: 'items.packing',
        select: 'name addtoprice',
      },
      {
        path: 'customer',
        select: 'name email phone',
      }
    ),
    getOrders
  )

  .post(protect, authorise('admin', 'user'), createOrder);

router
  .route('/:id')
  .put(protect, authorise('admin', 'owner'), updateOrderStatus)
  .get(protect, authorise('admin', 'owner'), getOrderDetails);

module.exports = router;
