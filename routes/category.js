const express = require('express');
const router = express.Router();
const {
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/category');

router.route('/').post(createCategory);
router
  .route('/:id')
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
