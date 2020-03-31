const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/category');

router
  .route('/')
  .get(getCategories)
  .post(createCategory);
router
  .route('/:id')
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
