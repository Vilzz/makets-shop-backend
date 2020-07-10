const mongoose = require('mongoose');

const BasketSchema = new mongoose.Schema({
  items: [
    {
      item: {
        type: mongoose.Schema.ObjectId,
        ref: 'Maket',
        required: true,
      },
      scale: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      packing: {
        type: mongoose.Schema.ObjectId,
        ref: 'Packing',
        required: true,
      },
      qty: {
        type: Number,
        required: true,
      },
      rowsum: {
        type: Number,
      },
    },
  ],
  total: {
    type: Number,
  },
  orderdate: {
    type: Date,
    default: Date.now,
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  deadline: {
    type: Date,
  },
  comment: {
    type: String,
  },
});

BasketSchema.statics.setBasketId = async function (userid, id) {
  try {
    await this.model('User').findByIdAndUpdate(userid, {
      basketid: id,
    });
  } catch (err) {
    console.error(err);
  }
};
BasketSchema.post('save', function () {
  this.constructor.setBasketId(this.customer, this._id);
});

module.exports = mongoose.model('Basket', BasketSchema);
