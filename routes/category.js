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

router
  .route('/')
  .get(advancedResults(Category), getCategories)
  .post(createCategory);
router
  .route('/:id')
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
