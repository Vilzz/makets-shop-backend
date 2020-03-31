const ErrorResponse = require('../utils/errorResponse');
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (err.name === 'CastError') {
    const message = `Ресурс с id - ${err.value} не найден`;
    error = new ErrorResponse(message, 404);
  }

  if (err.code === 11000) {
    const message = `Поле базы данных уже содержит такую запись -'${Object.keys(
      err.keyValue
    )}':'${Object.values(err.keyValue)}'`;
    error = new ErrorResponse(message, 400);
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Ошибка на стороне сервера'
  });
};

module.exports = errorHandler;
