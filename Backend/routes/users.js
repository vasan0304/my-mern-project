const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, superAdminOnly } = require('../middleware/auth');

router.use(protect, superAdminOnly);

router.get('/', async (req, res) => {
  const users = await User.find().populate('role').populate('department').populate('programme').select('-password');
  res.json(users);
});

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ message: 'User created', userId: user._id });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    if (req.body.password) delete req.body.password; // prevent password update here
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json(user);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// Get staff by role (for assignment)
router.get('/staff', async (req, res) => {
  const Role = require('../models/Role');
  const staffRoles = await Role.find({ roleName: { $ne: 'User', $ne: 'SuperAdmin' } });
  const staffRoleIds = staffRoles.map(r => r._id);
  const staff = await User.find({ role: { $in: staffRoleIds } }).populate('role').select('-password');
  res.json(staff);
});

module.exports = router;
