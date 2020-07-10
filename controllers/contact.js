const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Contact = require('../models/Contact');

// @desc Create contact
// @route POST /api/v1/contact
// @access Private
exports.createContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.create(req.body);
  res.status(201).json({ success: true, data: contact });
});

// @desc Update contact by id
// @route PUT /api/v1/contact/:id
// @access Private
exports.updateContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!contact) {
    return next(
      new ErrorResponse(`Ресурс с  id  - ${req.params.id} не найден`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: contact,
  });
});

// @desc Get contact by id
// @route GET /api/v1/contact/:id
// @access Private
exports.getContact = asyncHandler(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    return next(
      new ErrorResponse(`Ресурс с  id  - ${req.params.id} не найден`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: contact,
  });
});
