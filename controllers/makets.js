const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
//const path = require('path');
const Maket = require('../models/Maket');
const fs = require('fs');

// @desc Get all makets
// @route GET /api/v1/makets
// @access  Public
exports.getMakets = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
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
    data: maket,
  });
});

// @desc Get single maket by slug
// @route GET /api/v1/makets/slug/:slug
// @access  Public
exports.getMaketBySlug = asyncHandler(async (req, res, next) => {
  const maket = await Maket.findOne({ slug: `${req.params.slug}` }).populate({
    path: 'attributes',
    select: 'attributes lastupdated',
  });
  if (!maket) {
    return next(new ErrorResponse(`Ресурс не найден`, 404));
  }
  res.status(200).json({
    success: true,
    data: maket,
  });
});

// @desc Create new maket
// @route POST /api/v1/makets
// @access Private
exports.createMaket = asyncHandler(async (req, res, next) => {
  const {
    maketname,
    image,
    shortdesc,
    material,
    packing,
    category,
    description,
  } = req.body;
  const maketFields = {};

  if (maketname) maketFields.maketname = maketname;
  if (image) maketFields.image = image;
  if (shortdesc) maketFields.shortdesc = shortdesc;
  if (material) maketFields.material = material;
  if (packing) maketFields.packing = packing;
  if (category) maketFields.category = category;
  if (description) maketFields.description = description;
  // if (scales) {
  //   maketFields.scales = scales
  //     .toString()
  //     .split(',')
  //     .map((scale) => scale.trim());
  // }

  const maket = await Maket.create(maketFields);
  res.status(201).json({
    success: true,
    data: maket,
  });
});

// @desc Update maket by id
// @route PUT /api/v1/makets/:id
// @access Private
exports.updateMaket = asyncHandler(async (req, res, next) => {
  const fieldsForUpdate = {};
  const {
    maketname,
    image,
    shortdesc,
    material,
    packing,
    category,
    description,
  } = req.body;
  if (maketname) fieldsForUpdate.maketname = maketname;
  if (image) fieldsForUpdate.image = image;
  if (shortdesc) fieldsForUpdate.shortdesc = shortdesc;
  if (material) fieldsForUpdate.material = material;
  if (packing) fieldsForUpdate.packing = packing;
  if (category) fieldsForUpdate.category = category;
  if (description) fieldsForUpdate.description = description;
  // if (scales) {
  //   fieldsForUpdate.scales = scales
  //     .toString()
  //     .split(',')
  //     .map((scale) => scale.trim());
  // }

  const maket = await Maket.findByIdAndUpdate(req.params.id, fieldsForUpdate, {
    new: true,
    runValidators: true,
  });

  if (!maket) {
    return next(
      new ErrorResponse(`Ресурс с id - ${req.params.id} не найден`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: maket,
  });
});

// @desc Delete maket by id
// @route DELETE /api/v1/makets/:id
// @access Private
exports.deleteMaket = asyncHandler(async (req, res, next) => {
  const maket = await Maket.findById(req.params.id);
  if (!maket) {
    return next(
      new ErrorResponse(`Ресурс с id - ${req.params.id} не найден`, 404)
    );
  }
  await maket.remove();
  res.status(200).json({ success: true, data: {} });
});

// @desc Get images files list
// @route GET /api/v1/makets/images
// @access Private
exports.getFileList = asyncHandler(async (req, res, next) => {
  const fileList = await fs.readdir(
    `${process.env.FILE_UPLOAD_PATH}`,
    (err, files) => {
      if (err) {
        console.log(err);
        return next(
          new ErrorResponse(`Проблема при загрузке списка файлов`, 500)
        );
      } else {
        const filesObj = files.map((file, idx) => {
          return { id: idx, filename: file };
        });

        res.status(200).json({ success: true, data: filesObj });
      }
    }
  );
});

// @desc Upload image for maket
// @route PUT /api/v1/makets/:id/image
// @access Private
exports.maketImageUpload = (req, res, next) => {
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
  //file.name = `img_${maket.slug}${path.parse(file.name).ext}`;
  const fullpath = `${process.env.FILE_UPLOAD_PATH}${file.name}`;

  if (fs.existsSync(fullpath)) {
    fs.unlink(fullpath, (err) => {
      if (err) throw err;
      file.mv(fullpath, (err) => {
        if (err) {
          console.error(err);
          return next(new ErrorResponse(`Проблема при загрузке файла`, 500));
        }

        res.status(200).json({
          success: true,
          data: file.name,
        });
      });
    });
  } else {
    file.mv(fullpath, (err) => {
      if (err) {
        console.error(err);
        return next(new ErrorResponse(`Проблема при загрузке файла`, 500));
      }

      res.status(200).json({
        success: true,
        data: file.name,
      });
    });
  }
};
