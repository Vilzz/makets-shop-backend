const mongoose = require('mongoose');
const MaketSchema = new mongoose.Schema({
  maketname: {
    type: String,
    required: [true, 'Please add maket name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Maket name maxlength - 50 chars']
  },
  shortdesc: {
    type: String,
    required: [true, 'Please add maket short description'],
    maxlength: [300, 'Maket short description maxlength - 300 chars']
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: true
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
    default: 'Aluminium'
  },
  minprodtime: {
    type: String,
    default: '10 days'
  },
  instock: {
    type: Number
  },
  packing: {
    type: String,
    default: 'Standart'
  },
  description: {
    type: String,
    required: [true, 'Please add maket description'],
    maxlength: [1000, 'Maket description maxlength - 1000 chars']
  },
  slug: {
    type: String,
    unique: true
  }
});

module.exports = mongoose.model('Maket', MaketSchema);
