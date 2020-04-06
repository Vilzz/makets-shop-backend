const mongoose = require('mongoose');

const PriceSchema = new mongoose.Schema({
  prices: {
    sc_250: Number,
    sc_144: Number,
    sc_100: Number,
    sc_72: Number,
    sc_50: Number,
  },
  maketid: {
    type: mongoose.Schema.ObjectId,
    ref: 'Maket',
  },
  created: {
    type: Date,
    default: Date.now,
  },
});
PriceSchema.index({ maketid: 1 }, { unique: true });

module.exports = mongoose.model('Prices', PriceSchema);
