const mongoose = require('mongoose');
const CategorySchema = new mongoose.Schema({
  categoryname: {
    type: String,
    required: [true, 'Требуется добавить название категории'],
    unique: true,
    trim: true,
    maxlength: [50, 'Максимальная длина имени категории - 50 символов']
  },
  description: {
    type: String,
    required: [true, 'Требуется добавить описание категории'],
    maxlength: [1000, 'Максимальная длина описания категории - 1000 символов']
  },
  slug: {
    type: String,
    required: [true, 'Требуется заполнить поле - Slug (латинскими буквами)'],
    unique: true
  }
});

module.exports = mongoose.model('Category', CategorySchema);
