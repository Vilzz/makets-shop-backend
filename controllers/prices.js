const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Prices = require('../models/Prices');
const Maket = require('../models/Maket');

// @desc Get maket prices
// @route GET /api/v1/makets/:maketid/prices
// @access  Public
exports.getPrices = asyncHandler(async (req, res, next) => {
  if (req.params.maketid) {
    const prices = await Prices.find({ maketid: req.params.maketid });
    return res.status(200).json({
      success: true,
      count: prices.length,
      data: prices,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc Get single prices
// @route GET /api/v1/prices/:id
// @access  Public
exports.getPrice = asyncHandler(async (req, res, next) => {
  const price = await Prices.findById(req.params.id).populate({
    path: 'maketid',
    select: 'maketname description averageRating',
  });
  if (!price) {
    return next(
      new ErrorResponse(
        `Информация о товаре с ID: ${req.params.id} не найдена`
      ),
      500
    );
  }
  res.status(200).json({
    success: true,
    data: price,
  });
});

// @desc Add prices
// @route POST /api/v1/makets/:maketid/prices
// @access  Private
exports.addPrices = asyncHandler(async (req, res, next) => {
  req.body.maketid = req.params.maketid;

  const maket = await Maket.findById(req.params.maketid);

  if (!maket) {
    return next(new ErrorResponse(`Макет с ID: ${req.params.maketid}`, 404));
  }
  const prices = await Prices.create(req.body);
  res.status(201).json({
    success: true,
    data: prices,
  });
});

// @desc Update prices
// @route PUT /api/v1/prices/:id
// @access  Private
exports.updatePrices = asyncHandler(async (req, res, next) => {
  let prices = await Prices.findById(req.params.id);
  if (!prices) {
    return next(
      new ErrorResponse(
        `Информация о товаре с ID: ${req.params.id} не найдена`,
        404
      )
    );
  }

  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`Вы не можете изменить данную информацию`, 401)
    );
  }

  prices = await Prices.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: prices,
  });
});

// @desc Delete prices
// @route DELETE /api/v1/prices/:id
// @access  Private
exports.deletePrices = asyncHandler(async (req, res, next) => {
  const prices = await Prices.findById(req.params.id);

  if (!prices) {
    return next(
      new ErrorResponse(
        `Информация о товаре с ID: ${req.params.id} не найдена`,
        404
      )
    );
  }

  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`Вы не можете изменить данную информацию`, 401)
    );
  }

  await prices.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
