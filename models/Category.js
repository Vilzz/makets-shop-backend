const mongoose = require('mongoose');
const slugify = require('slugify');
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
    unique: true
  }
});

CategorySchema.pre('save', function(next) {
  this.slug = slugify(this.categoryname, { lower: true });
  next();
});

// CategorySchema.pre('delete', async function (next) {
//   await this.model('Course').deleteMany({ bootcamp: this._id });
//   next();
// });

module.exports = mongoose.model('Category', CategorySchema);
