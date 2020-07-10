const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Packing = require('../models/Packing');

// @desc Get all packing
// @route GET /api/v1/packing
// @access Public
exports.getPacking = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc Create new packing
// @route POST /api/v1/packing
// @access Private
exports.createPacking = asyncHandler(async (req, res, next) => {
  const packing = await Packing.create(req.body);
  res.status(201).json({ success: true, data: packing });
});

// @desc Get packing by id
// @route GET /api/v1/packing/:id
// @access Private
exports.getPackingById = asyncHandler(async (req, res, next) => {
  const packing = await Packing.findById(req.params.id);
  if (!packing) {
    return next(
      new ErrorResponse(`Ресурс с  id  - ${req.params.id} не найден`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: packing,
  });
});

// @desc Update packing by id
// @route PUT /api/v1/packing/:id
// @access Private
exports.updatePacking = asyncHandler(async (req, res, next) => {
  const packing = await Packing.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!packing) {
    return next(
      new ErrorResponse(`Ресурс с  id  - ${req.params.id} не найден`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: packing,
  });
});

// @desc Delete packing by id
// @route DELETE /api/v1/packing/:id
// @access Private
exports.deletePacking = asyncHandler(async (req, res, next) => {
  const packing = await Packing.findByIdAndDelete(req.params.id);
  if (!packing) {
    return next(
      new ErrorResponse(`Ресурс с id  - ${req.params.id} не найден`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});
