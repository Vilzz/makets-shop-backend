const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Basket = require('../models/Basket');

// @desc Create new Busket
// @route GET /api/v1/basket/check/:customerid
// @access Private
exports.checkBasketExists = asyncHandler(async (req, res, next) => {
  const basket = await Basket.findOne({ customer: req.params.customerid });
  if (!basket) {
    res.status(200).json({ success: true, data: null });
  } else {
    res.status(200).json({ success: true, data: basket._id });
  }
});

// @desc Count Busket items
// @route GET /api/v1/basket/count/:id
// @access Private
exports.countBasketItems = asyncHandler(async (req, res, next) => {
  const basket = await Basket.findById(req.params.id);
  if (basket) {
    res.status(200).json({ success: true, data: basket.items.length });
  } else {
    res.status(200).json({ success: true, data: 0 });
  }
});

// @desc Create new Busket
// @route POST /api/v1/basket
// @access Private
exports.createBasket = asyncHandler(async (req, res, next) => {
  const basket = await Basket.create(req.body);
  res.status(201).json({ success: true, data: basket });
});

// @desc Delete basket by id
// @route DELETE /api/v1/basket/:id
// @access Private
exports.deleteBasket = asyncHandler(async (req, res, next) => {
  const basket = await Basket.findById(req.params.id)
    .populate({
      path: 'customer',
      select: 'name address',
    })
    .populate({
      path: 'items.item',
      select: 'maketname image',
    })
    .populate({
      path: 'items.packing',
      select: 'name addtoprice',
    });
  if (!basket) {
    return next(
      new ErrorResponse(`Ресурс с id  - ${req.params.id} не найден`, 404)
    );
  }

  basket.items = [];
  basket.total = 0;
  await basket.save();
  res.status(200).json({ success: true, data: basket });
});

// @desc Get all baskets
// @route GET /api/v1/basket
// @access Public
exports.getBaskets = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc Get basket by id
// @route GET /api/v1/basket/:id
// @access Private
exports.getBasket = asyncHandler(async (req, res, next) => {
  const basket = await Basket.findById(req.params.id)
    .populate({
      path: 'customer',
      select: 'name address phone email',
    })
    .populate({
      path: 'items.item',
      select: 'maketname image',
    })
    .populate({
      path: 'items.packing',
      select: 'name addtoprice',
    });
  if (!basket) {
    return next(
      new ErrorResponse(`Ресурс с  id  - ${req.params.id} не найден`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: basket,
  });
});

// @desc Update basket by id
// @route PUT /api/v1/basket/:id
// @access Private
exports.updateBasket = asyncHandler(async (req, res, next) => {
  const basket = await Basket.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!basket) {
    return next(
      new ErrorResponse(`Ресурс с  id  - ${req.params.id} не найден`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: basket,
  });
});

// @desc Delete basket row
// @route PUT /api/v1/basket/row/:id
// @access Private

exports.deleteRow = asyncHandler(async (req, res, next) => {
  const rowid = req.body.id;
  const basketid = req.params.id;
  const basket = await Basket.findById(basketid)
    .populate({
      path: 'customer',
      select: 'name address',
    })
    .populate({
      path: 'items.item',
      select: 'maketname image',
    })
    .populate({
      path: 'items.packing',
      select: 'name addtoprice',
    });
  if (!basket) {
    return next(
      new ErrorResponse(`Ресурс с  id  - ${req.params.id} не найден`, 404)
    );
  }
  const removeIndex = basket.items.map((item) => item._id).indexOf(rowid);

  basket.items.splice(removeIndex, 1);
  if (basket.items.length > 0) {
    const newTotal = basket.items
      .map((item) => item.rowsum)
      .reduce((sum, item) => sum + item);
    basket.total = newTotal;
  } else {
    basket.total = 0;
  }

  await basket.save();
  res.status(200).json({
    success: true,
    data: basket,
  });
});
