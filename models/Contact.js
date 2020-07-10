const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Добавьте наименование компании'],
    maxlength: [100, 'Максимальная длина наименования - 100 символов'],
  },
  companyaddress: {
    type: String,
    required: [true, 'Добавьте адрес компании'],
    maxlength: [500, 'Максимальная длина наименования - 500 символов'],
  },
  companyphone: {
    type: String,
    required: [true, 'Введите номер телефона'],
    match: [
      /^((\+7|7|8)+([0-9]){10})$/,
      'Номер телефона не соответствует формату 89997777777 или +79997777777',
    ],
  },
  companyemail: {
    type: String,
    required: [true, 'Введите адрес электронной почты'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Требуется адрес электронной почты',
    ],
  },
  companyinstagram: {
    type: String,
  },
});

module.exports = mongoose.model('Contact', ContactSchema);
