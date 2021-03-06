const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');

// @desc Register User route
// @route POST /api/v1/auth/register
// @access Public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  const token = user.getSignedJwtToken();
  const id = user._id;
  res.status(200).json({ success: true, token, id });
});

// @desc Login User route
// @route POST /api/v1/auth/login
// @access Public
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Требуется пароль и email'), 400);
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Данные не верны'), 401);
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Данные не верны'), 401);
  }

  sendTokenResponse(user, 200, res);
});

// @desc Log user out clear cookie
// @route GET /api/v1/auth/logout
// @access Private
exports.logOut = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc Get current logged in user
// @route POST /api/v1/auth/me
// @access Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc Update user password
// @route PUT /api/v1/auth/updatepassword
// @access Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Неверный пароль', 401));
  }
  user.password = req.body.newPassword;
  await user.save();
  sendTokenResponse(user, 200, res);
});

// @desc Update user address
// @route PUT /api/v1/auth/updateprofilephone
// @access Private
exports.updateUserPhone = asyncHandler(async (req, res, next) => {
  const phone = req.body.phone === '' ? '+70000000000' : req.body.phone;
  //Пeределать на req.user.id  
  const user = await User.findByIdAndUpdate(
    req.body.id,
    { phone },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc Update user address
// @route PUT /api/v1/auth/updateprofileaddress
// @access Private
exports.updateUserAddress = asyncHandler(async (req, res, next) => {
  const address =
    req.body.address === '      ' ? 'Адрес не указан' : req.body.address;

  const user = await User.findByIdAndUpdate(
    req.body.id,
    { address },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc Update user profile
// @route PUT /api/v1/auth/updateprofile
// @access Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc Update User role
// @route PUT /api/v1/auth/setrole/:id
// @access Private
exports.setRoleToUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(
      new ErrorResponse(`Пользователь с  id  - ${req.params.id} не найден`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc Forgot password
// @route POST /api/v1/auth/forgotpassword
// @access Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ErrorResponse(
        `Пользователь с почтой - ${req.body.email} не найден`,
        404
      )
    );
  }
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // const resetUrl = `${req.protocol}://${req.get(
  //   'host'
  // )}/api/v1/auth/resetpassword/${resetToken}`;
  const resetUrl = `${req.protocol}://localhost:3000/resetpassword/${resetToken}`;

  const message = `<p>Мы отправили вам это письмо потому что вы или кто-то еще запросил сброс пароля.<br /> 
  Для завершения процедуры перейдите по ссылке:</p> 
  <a href='${resetUrl}'>Перейти на сайт для сброса пароля</a>
  <p>Проигнорируйте данное письмо если вы не отправляли запрос на изменение учетных данных</p>`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Запрос на смену пароля',
      message,
    });
    res.status(200).json({ success: true, data: 'Письмо отправлено' });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse('Письмо не может быть отправлено', 500));
  }
});

// @desc Reset password
// @route PUT /api/v1/auth/resetpassword/:resettoken
// @access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorResponse('Неверный токен сброса пароля', 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendTokenResponse(user, 200, res);
});

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};
