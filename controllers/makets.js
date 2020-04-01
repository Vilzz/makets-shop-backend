const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const path = require('path');
const Maket = require('../models/Maket');

// @desc Get all makets
// @route GET /api/v1/makets
// @access  Public
exports.getMakets = asyncHandler(async (req, res, next) => {
  let query;
  const reqQuery = { ...req.query };
  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach(param => delete reqQuery[param]);
  query = Maket.find(reqQuery);

  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  }
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Maket.countDocuments();

  query = query.skip(startIndex).limit(limit);
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  const makets = await query;
  res.status(200).json({
    success: true,
    count: makets.length,
    pagination,
    data: makets
  });
});

// @desc Get single maket
// @route GET /api/v1/makets/:id
// @access  Public
exports.getMaket = asyncHandler(async (req, res, next) => {
  const maket = await Maket.findById(req.params.id);
  if (!maket) {
    return next(
      new ErrorResponse(`Ресурс с id - ${req.params.id} не найден`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: maket
  });
});

// @desc Create new maket
// @route POST /api/v1/makets
// @access Private
exports.createMaket = asyncHandler(async (req, res, next) => {
  const maket = await Maket.create(req.body);
  res.status(201).json({
    success: true,
    data: maket
  });
});

// @desc Update maket by id
// @route PUT /api/v1/makets/:id
// @access Private
exports.updateMaket = asyncHandler(async (req, res, next) => {
  const maket = await Maket.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!maket) {
    return next(
      new ErrorResponse(`Ресурс с id - ${req.params.id} не найден`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: maket
  });
});

// @desc Delete maket by id
// @route DELETE /api/v1/makets/:id
// @access Private
exports.deleteMaket = asyncHandler(async (req, res, next) => {
  const maket = await Maket.findByIdAndDelete(req.params.id);
  if (!maket) {
    return next(
      new ErrorResponse(`Ресурс с id - ${req.params.id} не найден`, 404)
    );
  }
  res.status(200).json({ success: true, data: {} });
});

// @desc Upload image for maket
// @route PUT /api/v1/makets/:id/image
// @access Private
exports.maketImageUpload = asyncHandler(async (req, res, next) => {
  const maket = await Maket.findById(req.params.id);
  if (!maket) {
    return next(
      new ErrorResponse(`Ресурс с id - ${req.params.id} не найден`, 404)
    );
  }
  if (!req.files) {
    return next(new ErrorResponse('Добавь файл с изображением', 400));
  }
  const file = req.files.file;

  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Требуется файл изображения', 400));
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Размер файла изображения не более ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }
  file.name = `photo_${maket._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Проблема при загрузке файла`, 500));
    }
    await Maket.findByIdAndUpdate(req.params.id, { image: file.name });
    res.status(200).json({
      success: true,
      data: file.name
    });
  });
});
