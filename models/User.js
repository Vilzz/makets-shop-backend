const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Orders = require('./Orders');
const Basket = require('./Basket');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Введите имя'],
  },
  email: {
    type: String,
    required: [true, 'Введите адрес электронной почты'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Требуется адрес электронной почты',
    ],
  },
  address: {
    type: String,
    default: 'Адрес не указан',
    maxlength: [500, 'Максимальная длина адреса - 500 символов'],
  },
  phone: {
    type: String,
    required: [true, 'Введите номер телефона'],
    default: '+70000000000',
    match: [
      /^((\+7|7|8)+([0-9]){10})$/,
      'Номер телефона не соответствует формату 89997777777 или +79997777777',
    ],
  },
  basketid: {
    type: mongoose.Schema.ObjectId,
    ref: 'Basket',
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'owner'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Требуется пароль'],
    minlength: [6, 'Минимальная длина пароля - 6 символов'],
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.pre('deleteOne', async function (next) {
  await Orders.deleteMany({ customer: this._conditions._id });
  await Basket.deleteOne({ customer: this._conditions._id });
  next();
});

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
