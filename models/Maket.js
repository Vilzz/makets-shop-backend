const mongoose = require('mongoose');
const MaketSchema = new mongoose.Schema({
  maketname: {
    type: String,
    required: [true, 'Требуется добавить имя макета'],
    unique: true,
    trim: true,
    maxlength: [50, 'Максимальная длина макета - 50 символов']
  },
  shortdesc: {
    type: String,
    required: [true, 'Требуется добавить краткое описание макета'],
    maxlength: [
      300,
      'Максимальная длина краткого описания макета - 300 символов'
    ]
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Требуется указать ID категории']
  },
  image: {
    type: String,
    default: 'no-image.jpg'
  },
  scales: {
    type: [Number],
    required: true,
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

module.exports = mongoose.model('Maket', MaketSchema);
