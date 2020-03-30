const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ success: true, msg: 'Show all makets' });
});
router.get('/:id', (req, res) => {
  res.status(200).json({
    success: true,
    msg: `Show maket with ID - ${req.params.id}`
  });
});
router.post('/', (req, res) => {
  res.status(200).json({ success: true, msg: 'Create new maket' });
});
router.put('/:id', (req, res) => {
  res.status(200).json({
    success: true,
    msg: `Update maket with ID - ${req.params.id}`
  });
});
router.delete('/:id', (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete maket with ID - ${req.params.id}` });
});

module.exports = router;
