const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const { protect, superAdminOnly } = require('../middleware/auth');

router.use(protect, superAdminOnly);

router.get('/', async (req, res) => {
  const departments = await Department.find().sort('departmentName');
  res.json(departments);
});

router.post('/', async (req, res) => {
  try {
    const dept = await Department.create(req.body);
    res.status(201).json(dept);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(dept);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  await Department.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
