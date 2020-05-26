const mongoose = require('mongoose');

const AttributesSchema = new mongoose.Schema({
  maketid: {
    type: mongoose.Schema.ObjectId,
    ref: 'Maket',
  },
  attributes: [
    {
      scalesize: Number,
      price: Number,
      w_netto: Number,
      w_bruto: Number,
      height: Number,
      instock: Number,
      minprodtime: String,
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
