const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Attributes = require('../models/Attributes');

// @desc Get all attributes
// @route GET /api/v1/attributes
// @access Private
exports.getAttributes = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});
// @desc Get attributes by ID
// @route GET /api/v1/attributes/:id
// @access Private
exports.getAttributesById = asyncHandler(async (req, res, next) => {
  const attributes = await Attributes.findById(req.params.id).populate({
    path: 'maketid',
    select: 'maketname',
  });
  if (!attributes) {
    return next(
      new ErrorResponse(`Ресурс с  id  - ${req.params.id} не найден`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: attributes,
  });
});

// @desc Create new attributes
// @route POST /api/v1/attributes
// @access Private
exports.createAttributes = asyncHandler(async (req, res, next) => {
  const maketid = req.params.id;

  const attributes = await Attributes.create({
    maketid,
    attributes: [...req.body],
    lastupdated: Date.now(),
  });
  res.status(201).json({ success: true, data: attributes });
});

// @desc Update attributes by id
// @route PUT /api/v1/attributes/:id
// @access Private
exports.updateAttributes = asyncHandler(async (req, res, next) => {
  const updateData = { ...req.body, lastupdated: Date.now() };

  const attributes = await Attributes.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!attributes) {
    return next(
      new ErrorResponse(`Ресурс с id - ${req.params.id} не найден`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: attributes,
  });
});

// @desc DELETE attributes group
// @route DELETE /api/v1/attributes/group/:groupid
// @access Private

exports.deleteAttrGroup = asyncHandler(async (req, res, next) => {
  const docId = req.body.id;
  const arrElId = req.params.groupid;

  const attributes = await Attributes.findOne({ _id: docId }).populate({
    path: 'maketid',
    select: 'maketname',
  });
  if (!attributes) {
    return next(new ErrorResponse(`Ресурс с id - ${docId} не найден`, 404));
  }
  // Находим индекс удаляемого обьекта
  const removeIndex = attributes.attributes
    .map((attr) => attr._id)
    .indexOf(arrElId);
  //Удаляем обьект из массива
  attributes.attributes.splice(removeIndex, 1);
  // Сохраняем в базу
  await attributes.save();
  res.status(200).json({
    success: true,
    data: attributes,
  });
});

// @desc Add attributes group
// @route PUT /api/v1/attributes/group
// @access Private
exports.addAttrGroup = asyncHandler(async (req, res, next) => {
  const attributes = await Attributes.findOne({
    _id: req.params.groupid,
  }).populate({
    path: 'maketid',
    select: 'maketname',
  });
  attributes.attributes.push(req.body);

  await attributes.save();

  res.status(200).json({
    success: true,
    data: attributes,
  });
});
