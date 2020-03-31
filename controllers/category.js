const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Category = require('../models/Category');

// @desc Get all categories
// @route GET /api/v1/category
// @access Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
});
// @desc Create new category
// @route POST /api/v1/category
// @access Private
exports.createCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, data: category });
});

// @desc Update category by id
// @route PUT /api/v1/category/:id
// @access Private
exports.updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!category) {
    return next(
      new ErrorResponse(`Ресурс с  id  - ${req.params.id} не найден`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: category
  });
});

// @desc Delete category by id
// @route DELETE /api/v1/category/:id
// @access Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return next(
      new ErrorResponse(`Ресурс с id  - ${req.params.id} не найден`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});
