const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/category');
const Category = require('../models/Category');
const advancedResults = require('../middleware/advancedResults');
const { protect } = require('../middleware/auth');

router
  .route('/')
  .get(advancedResults(Category), getCategories)
  .post(protect, createCategory);
router
  .route('/:id')
  .put(protect, updateCategory)
  .delete(protect, deleteCategory);

module.exports = router;
