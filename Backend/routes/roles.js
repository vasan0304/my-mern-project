const express = require('express');
const router = express.Router();
const Role = require('../models/Role');
const { protect, superAdminOnly } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  const roles = await Role.find().sort('roleName');
  res.json(roles);
});

router.post('/', protect, superAdminOnly, async (req, res) => {
  try {
    const role = await Role.create(req.body);
    res.status(201).json(role);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protect, superAdminOnly, async (req, res) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(role);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protect, superAdminOnly, async (req, res) => {
  await Role.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
