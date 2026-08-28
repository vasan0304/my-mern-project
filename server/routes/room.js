const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Room = require('../models/Room');
const Block = require('../models/Block');

// Create room
router.post('/', auth, authorize('superadmin', 'admin'), async (req, res) => {
  try {
    const { roomNumber, block, floor, type, capacity } = req.body;
    const room = new Room({ roomNumber, block, floor, type, capacity });
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all rooms
router.get('/', auth, async (req, res) => {
  try {
    const rooms = await Room.find({ isActive: true })
      .populate('block', 'name code');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get rooms by block
router.get('/block/:blockId', auth, async (req, res) => {
  try {
    const rooms = await Room.find({ 
      block: req.params.blockId,
      isActive: true 
    });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update room
router.put('/:id', auth, authorize('superadmin', 'admin'), async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete room
router.delete('/:id', auth, authorize('superadmin', 'admin'), async (req, res) => {
  try {
    await Room.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Room deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;