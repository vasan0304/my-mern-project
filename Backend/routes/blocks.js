const express = require('express');
const router = express.Router();
const Block = require('../models/Block');
const { protect, superAdminOnly } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  const { department, programme } = req.query;
  const filter = {};
  if (department) filter.department = department;
  if (programme) filter.programme = programme;
  const blocks = await Block.find(filter).populate('department').populate('programme').sort('blockName');
  res.json(blocks);
});

router.post('/', protect, superAdminOnly, async (req, res) => {
  try {
    const block = await Block.create(req.body);
    res.status(201).json(block);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protect, superAdminOnly, async (req, res) => {
  try {
    const block = await Block.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(block);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protect, superAdminOnly, async (req, res) => {
  await Block.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
