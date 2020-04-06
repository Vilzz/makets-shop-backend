const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorRersponse = require('../utils/errorResponse');
const User = require('../models/User');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // else if (req.cookies.token) {
  //  token = req.cookies.token;
  // }

  if (!token) {
    return next(
      new ErrorRersponse(
        'Доступно только для зарегистрированных пользователей',
        401
      )
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(
      new ErrorRersponse(
        'Доступно только для зарегистрированных пользователей',
        401
      )
    );
  }
});

exports.authorise = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorRersponse(
          `Данная операция не доступна для пользователя с ролью - ${req.user.role}`,
          403
        )
      );
    }
    next();
  };
};
