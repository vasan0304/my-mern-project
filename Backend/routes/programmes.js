const express = require('express');
const router = express.Router();
const Programme = require('../models/Programme');
const { protect, superAdminOnly } = require('../middleware/auth');

router.use(protect, superAdminOnly);

router.get('/', async (req, res) => {
  const { department } = req.query;
  const filter = department ? { department } : {};
  const programmes = await Programme.find(filter).populate('department').sort('programmeName');
  res.json(programmes);
});

router.post('/', async (req, res) => {
  try {
    const prog = await Programme.create(req.body);
    res.status(201).json(prog);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const prog = await Programme.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(prog);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  await Programme.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
