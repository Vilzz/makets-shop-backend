const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Требуется добавить заголовок'],
    trim: true,
    maxlength: [100, 'Максимальная длина имени заголовка - 100 символов'],
  },
  text: {
    type: String,
    required: [true, 'Требуется добавить отзыв'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'Добавьте значение рейтинга от 1 до 10'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  maket: {
    type: mongoose.Schema.ObjectId,
    ref: 'Maket',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

ReviewSchema.index({ maket: 1, user: 1 }, { unique: true });

ReviewSchema.statics.getAverageRating = async function (maketid) {
  const obj = await this.aggregate([
    {
      $match: { maket: maketid },
    },
    {
      $group: {
        _id: '$maket',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  try {
    await this.model('Maket').findByIdAndUpdate(maketid, {
      averageRating: obj[0].averageRating,
    });
  } catch (err) {
    console.error(err);
  }
};

ReviewSchema.post('save', function () {
  this.constructor.getAverageRating(this.maket);
});
ReviewSchema.pre('remove', function () {
  this.constructor.getAverageRating(this.maket);
});
module.exports = mongoose.model('Review', ReviewSchema);
