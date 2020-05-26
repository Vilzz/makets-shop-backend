const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Order = require('../models/Orders');

// @desc Create new order
// @route POST /api/v1/orders
// @access Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.create(req.body);
  res.status(201).json({ success: true, data: order });
});

// @desc Update order status
// @route PUT /api/v1/orders/:id
// @access Private
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!order) {
    return next(
      new ErrorResponse(`Ресурс с  id  - ${req.params.id} не найден`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: order,
  });
});

// @desc Get all orders
// @route GET /api/v1/orders
// @access Public
exports.getOrders = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc Get order details
// @route GET /api/v1/orders/:id
// @access  Private
exports.getOrderDetails = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate({
      path: 'items.item',
      select: 'maketname',
    })
    .populate({
      path: 'customer',
      select: 'name email phone',
    });
  if (!order) {
    return next(
      new ErrorResponse(
        `Информация о заказе с ID: ${req.params.id} не найдена`
      ),
      500
    );
  }
  res.status(200).json({
    success: true,
    data: order,
  });
});
