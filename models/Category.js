const mongoose = require('mongoose');
const CategorySchema = new mongoose.Schema({
  categoryname: {
    type: String,
    required: [true, 'Please add category name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Category name maxlength - 50 chars']
  },
  description: {
    type: String,
    required: [true, 'Please add category description'],
    maxlength: [1000, 'Category description maxlength - 1000 chars']
  },
  slug: String
});

module.exports = mongoose.model('Category', CategorySchema);
