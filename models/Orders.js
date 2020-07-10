const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const OrderSchema = new mongoose.Schema({
  ordernumber: Number,
  items: [
    {
      item: { type: mongoose.Schema.ObjectId, ref: 'Maket' },
      qty: { type: Number, required: true },
      scale: { type: String, required: true },
      price: { type: Number, require: true },
      packing: {
        type: mongoose.Schema.ObjectId,
        ref: 'Packing',
        required: true,
      },
      rowsum: {
        type: Number,
      },
    },
  ],
  total: {
    type: Number,
    require: true,
  },
  orderdate: {
    type: Date,
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['Новый', 'Оплачен', 'В работе', 'Отменен', 'Выполнен', 'Отправлен'],
    default: 'Новый',
  },
  comment: {
    type: String,
    deafault: 'No comment',
  },
});
OrderSchema.plugin(AutoIncrement, { inc_field: 'ordernumber' });

module.exports = mongoose.model('Order', OrderSchema);
