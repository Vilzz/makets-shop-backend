const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
} = require('../controllers/category');
const Category = require('../models/Category');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorise } = require('../middleware/auth');

router
  .route('/')
  .get(advancedResults(Category), getCategories)
  .post(protect, authorise('admin', 'owner'), createCategory);
router
  .route('/:id')
  .put(protect, authorise('admin', 'owner'), updateCategory)
  .delete(protect, authorise('admin', 'owner'), deleteCategory)
  .get(protect, authorise('admin', 'owner'), getCategory);
module.exports = router;
