const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Maket = require('../models/Maket');

// @desc Get all makets
// @route GET /api/v1/makets
// @access  Public
exports.getMakets = asyncHandler(async (req, res, next) => {
  let query;
  const reqQuery = { ...req.query };
  const removeFields = ['select', 'sort'];
  removeFields.forEach(param => delete reqQuery[param]);
  query = Maket.find(reqQuery);

  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  }

  const makets = await query;
  res.status(200).json({
    success: true,
    count: makets.length,
    data: makets
  });
});

// @desc Get single maket
// @route GET /api/v1/makets/:id
// @access  Public
exports.getMaket = asyncHandler(async (req, res, next) => {
  const maket = await Maket.findById(req.params.id);
  if (!maket) {
    return next(
      new ErrorResponse(`Ресурс с id - ${req.params.id} не найден`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: maket
  });
});

// @desc Create new maket
// @route POST /api/v1/makets
// @access Private
exports.createMaket = asyncHandler(async (req, res, next) => {
  const maket = await Maket.create(req.body);
  res.status(201).json({
    success: true,
    data: maket
  });
});

// @desc Update maket by id
// @route PUT /api/v1/makets/:id
// @access Private
exports.updateMaket = asyncHandler(async (req, res, next) => {
  const maket = await Maket.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!maket) {
    return next(
      new ErrorResponse(`Ресурс с id - ${req.params.id} не найден`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: maket
  });
});

// @desc Delete maket by id
// @route DELETE /api/v1/makets/:id
// @access Private
exports.deleteMaket = asyncHandler(async (req, res, next) => {
  const maket = await Maket.findByIdAndDelete(req.params.id);
  if (!maket) {
    return next(
      new ErrorResponse(`Ресурс с id - ${req.params.id} не найден`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});
