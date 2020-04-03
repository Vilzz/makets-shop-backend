const mongoose = require('mongoose');
const slugify = require('slugify');

const MaketSchema = new mongoose.Schema({
  maketname: {
    type: String,
    required: [true, 'Требуется добавить имя макета'],
    unique: true,
    trim: true,
    maxlength: [50, 'Максимальная длина имени макета - 50 символов']
  },
  shortdesc: {
    type: String,
    required: [true, 'Требуется добавить краткое описание макета'],
    maxlength: [
      300,
      'Максимальная длина краткого описания макета - 300 символов'
    ]
  },
  category: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Category'
    }
  ],
  image: {
    type: String,
    default: 'no-image.jpg'
  },
  scales: {
    type: [Number],
    required: [true, 'Доступные масштабы - 250,144,100,72,50'],
    enum: [250, 144, 100, 72, 50]
  },
  material: {
    type: String,
    default: 'Алюминий'
  },
  minprodtime: {
    type: String,
    default: '10 дней'
  },
  instock: {
    type: Number
  },
  packing: {
    type: String,
    default: 'Стандартная'
  },
  description: {
    type: String,
    required: [true, 'Требуется добавить описание макета'],
    maxlength: [1000, 'Максимальная длина описания макета - 1000 символов']
  },
  slug: {
    type: String,
    unique: true
  }
});

MaketSchema.pre('save', function(next) {
  this.slug = slugify(this.maketname, { lower: true });
  next();
});

module.exports = mongoose.model('Maket', MaketSchema);
