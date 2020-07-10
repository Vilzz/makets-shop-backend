const mongoose = require('mongoose');

const AttributesSchema = new mongoose.Schema({
  maketid: {
    type: mongoose.Schema.ObjectId,
    ref: 'Maket',
  },
  attributes: [
    {
      scalesize: {
        type: Number,
        required: [true, 'Требуется масштаб макета!'],
      },
      price: {
        type: Number,
        required: [true, 'Требуется цена за масштаб макета!'],
      },
      w_netto: {
        type: Number,
        required: [true, 'Требуется вес изделия без упаковки!'],
      },
      w_bruto: {
        type: Number,
        required: [true, 'Требуется вес изделия с упаковкой!'],
      },
      height: {
        type: String,
        required: [
          true,
          'Требуется размер изделия ширина х длина х высота макета!',
        ],
      },
      instock: {
        type: Number,
        default: 0,
      },
      minprodtime: {
        type: Number,
        required: [true, 'Требуется минимальный срок производства макета!'],
      },
    },
  ],

  lastupdated: {
    type: Date,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

AttributesSchema.statics.setAttributesId = async function (maketid, id) {
  try {
    await this.model('Maket').findByIdAndUpdate(maketid, {
      attributes: id,
    });
  } catch (err) {
    console.error(err);
  }
};
AttributesSchema.post('save', function () {
  this.constructor.setAttributesId(this.maketid, this._id);
});

module.exports = mongoose.model('Attributes', AttributesSchema);
