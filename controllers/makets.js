// @desc Get all makets
// @route GET /api/v1/makets
// @access  Public
exports.getMakets = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: 'Show all makets'
  });
};

// @desc Get single maket
// @route GET /api/v1/makets/:id
// @access  Public
exports.getMaket = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Show maket with ID - ${req.params.id}`
  });
};

// @desc Create new maket
// @route POST /api/v1/makets
// @access Private
exports.createMaket = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Create new maket' });
};

// @desc Update maket by id
// @route PUT /api/v1/makets/:id
// @access Private
exports.updateMaket = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Update maket with ID - ${req.params.id}`
  });
};

// @desc Delete maket by id
// @route DELETE /api/v1/makets/:id
// @access Private
exports.deleteMaket = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete maket with ID - ${req.params.id}` });
};
