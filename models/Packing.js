const mongoose = require('mongoose');

const PackingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Добавьте наименование упаковки!'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Добавьте описание упаковки'],
    max: [300, 'Максимальное количество знаков описания - 300!'],
  },
  addtoprice: {
    type: Number,
    required: [true, 'Добавьте цену упаковки'],
  },
});

module.exports = mongoose.model('Packing', PackingSchema);
