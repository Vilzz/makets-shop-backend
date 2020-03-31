const Category = require('../models/Category');

// @desc Create new category
// @route POST /api/v1/category
// @access Private
exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

// @desc Update category by id
// @route PUT /api/v1/category/:id
// @access Private
exports.updateCategory = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Update category with ID - ${req.params.id}`
  });
};

// @desc Delete category by id
// @route DELETE /api/v1/category/:id
// @access Private
exports.deleteCategory = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete category with ID - ${req.params.id}` });
};
