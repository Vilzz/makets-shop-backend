const mongoose = require('mongoose');
const slugify = require('slugify');

function validator(arr) {
  const enum_array = [250, 200, 144, 100, 72, 50];
  const found = arr.every((r) => enum_array.includes(r));
  return found;
}
function anotherValidator(arr) {
  if (arr.length > 0) {
    return true;
  } else {
    return false;
  }
}
const many = [
  {
    validator: validator,
    msg:
      'Значение в списке масштабов отличается от допустимых значений 250 144 100 72 50',
  },
  {
    validator: anotherValidator,
    msg: 'Требуется добавить хотя бы один масштаб',
  },
];

const MaketSchema = new mongoose.Schema({
  maketname: {
    type: String,
    required: [true, 'Требуется добавить имя макета'],
    trim: true,
    maxlength: [50, 'Максимальная длина имени макета - 50 символов'],
  },
  shortdesc: {
    type: String,
    required: [true, 'Требуется добавить краткое описание макета'],
    maxlength: [
      300,
      'Максимальная длина краткого описания макета - 300 символов',
    ],
  },
  attributes: {
    type: mongoose.Schema.ObjectId,
    ref: 'Attributes',
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
  },
  image: {
    type: String,
    default: 'no-image.jpg',
  },
  averageRating: {
    type: Number,
    min: [1, 'Минимальное значение рейтинга 1'],
    max: [10, 'Максимальное значение рейтинга 10'],
  },
  material: {
    type: String,
    default: 'Алюминий',
  },
  packing: {
    type: String,
    default: 'Стандартная',
  },
  description: {
    type: String,
    required: [true, 'Требуется добавить описание макета'],
    maxlength: [1000, 'Максимальная длина описания макета - 1000 символов'],
  },
  slug: {
    type: String,
    unique: true,
  },
});

MaketSchema.pre('save', function (next) {
  this.slug = slugify(this.maketname, { lower: true });
  next();
});

module.exports = mongoose.model('Maket', MaketSchema);
