const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviews');
const Review = require('../models/Review');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorise } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(Review, { 
      path: 'maket', 
      select: 'name description' 
    }),
    getReviews
  )
  .post(protect, authorise('user', 'admin'), addReview);

router
  .route('/:id')
  .get(getReview)
  .put(protect, authorise('user', 'admin'), updateReview)
  .delete(protect, authorise('user', 'admin'), deleteReview);

module.exports = router;
