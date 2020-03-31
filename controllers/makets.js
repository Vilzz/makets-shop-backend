const ErrorResponse = require('../utils/errorResponse');
const Maket = require('../models/Maket');

// @desc Get all makets
// @route GET /api/v1/makets
// @access  Public
exports.getMakets = async (req, res, next) => {
  try {
    const makets = await Maket.find();

    res.status(200).json({
      success: true,
      count: makets.length,
      data: makets
    });
  } catch (err) {
    next(err);
  }
};

// @desc Get single maket
// @route GET /api/v1/makets/:id
// @access  Public
exports.getMaket = async (req, res, next) => {
  try {
    const maket = await Maket.findById(req.params.id);
    if (!maket) {
      return next(
        new ErrorResponse(`Ресурс с id  - ${req.params.id} не найден`, 404)
      );
    }
    res.status(200).json({
      success: true,
      data: maket
    });
  } catch (err) {
    next(err);
  }
};

// @desc Create new maket
// @route POST /api/v1/makets
// @access Private
exports.createMaket = async (req, res, next) => {
  try {
    const maket = await Maket.create(req.body);
    res.status(201).json({
      success: true,
      data: maket
    });
  } catch (err) {
    next(err);
  }
};

// @desc Update maket by id
// @route PUT /api/v1/makets/:id
// @access Private
exports.updateMaket = async (req, res, next) => {
  try {
    const maket = await Maket.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!maket) {
      return next(
        new ErrorResponse(`Ресурс с  id  - ${req.params.id} не найден`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: maket
    });
  } catch (err) {
    next(err);
  }
};

// @desc Delete maket by id
// @route DELETE /api/v1/makets/:id
// @access Private
exports.deleteMaket = async (req, res, next) => {
  try {
    await Maket.findByIdAndDelete(req.params.id);
    if (!maket) {
      return next(
        new ErrorResponse(`Ресурс с id  - ${req.params.id} не найден`, 404)
      );
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
