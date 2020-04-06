const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Review = require('../models/Review');
const Maket = require('../models/Maket');
const User = require('../models/User');

// @desc Get reviews
// @route GET /api/v1/makets/:maketid/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.maketid) {
    const reviews = await Review.find({ maket: req.params.maketid });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc Get single review
// @route GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'maket',
    select: 'maketname description',
  });
  if (!review) {
    return next(
      new ErrorResponse(`Комментарий с ID: ${req.params.id} не найден`),
      500
    );
  }
  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc Add review
// @route POST /api/v1/makets/:maketid/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.maket = req.params.maketid;
  req.body.user = req.user.id;

  const maket = await Maket.findById(req.params.maketid);
  if (!maket) {
    return next(new ErrorResponse(`Макет с ID: ${req.params.maketid}`, 404));
  }
  const review = await Review.create(req.body);
  res.status(201).json({
    success: true,
    data: review,
  });
});

// @desc Update review
// @route PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  if (!review) {
    return next(
      new ErrorResponse(`Отзыв с ID: ${req.params.id} не найден`, 404)
    );
  }

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Вы не можете изменить данный отзыв`, 401));
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc Delete review
// @route DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(
      new ErrorResponse(`Отзыв с ID: ${req.params.id} не найден`, 404)
    );
  }

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Вы не можете изменить данный отзыв`, 401));
  }

  await review.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
