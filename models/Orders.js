const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const OrderSchema = new mongoose.Schema({
  ordernum: Number,
  items: [
    {
      item: { type: mongoose.Schema.ObjectId, ref: 'Maket' },
      qty: { type: Number, required: true },
      scale: { type: String, required: true },
    },
  ],
  orderdate: {
    type: Date,
    default: Date.now,
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
  },
});
OrderSchema.plugin(AutoIncrement, { inc_field: 'ordernumber' });

module.exports = mongoose.model('Order', OrderSchema);
