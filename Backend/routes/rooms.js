const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const { protect, superAdminOnly } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  const { block } = req.query;
  const filter = block ? { block } : {};
  const rooms = await Room.find(filter).populate('department').populate('programme').populate('block').sort('roomNumber');
  res.json(rooms);
});

router.post('/', protect, superAdminOnly, async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protect, superAdminOnly, async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(room);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protect, superAdminOnly, async (req, res) => {
  await Room.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
