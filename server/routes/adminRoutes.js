const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Department = require('../models/Department');
const Programme = require('../models/Programme');
const Block = require('../models/Block');
const Room = require('../models/Room');
const Role = require('../models/Role');
const User = require('../models/User');

// Department CRUD
router.post('/departments', auth, authorize('superadmin', 'admin'), async (req, res) => {
  try {
    const { name, code, description } = req.body;
    const department = new Department({ name, code, description });
    await department.save();
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/departments', auth, async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/departments/:id', auth, authorize('superadmin', 'admin'), async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/departments/:id', auth, authorize('superadmin', 'admin'), async (req, res) => {
  try {
    await Department.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Department deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Programme CRUD
router.post('/programmes', auth, authorize('superadmin', 'admin'), async (req, res) => {
  try {
    const { name, code, department, duration } = req.body;
    const programme = new Programme({ name, code, department, duration });
    await programme.save();
    res.status(201).json(programme);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/programmes', auth, async (req, res) => {
  try {
    const programmes = await Programme.find({ isActive: true })
      .populate('department', 'name code');
    res.json(programmes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Block CRUD
router.post('/blocks', auth, authorize('superadmin', 'admin'), async (req, res) => {
  try {
    const { name, code, description } = req.body;
    const block = new Block({ name, code, description });
    await block.save();
    res.status(201).json(block);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/blocks', auth, async (req, res) => {
  try {
    const blocks = await Block.find({ isActive: true });
    res.json(blocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Role CRUD
router.post('/roles', auth, authorize('superadmin'), async (req, res) => {
  try {
    const { name, description, permissions } = req.body;
    const role = new Role({ name, description, permissions });
    await role.save();
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/roles', auth, async (req, res) => {
  try {
    const roles = await Role.find({ isActive: true });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User Management
router.get('/users', auth, authorize('superadmin', 'admin'), async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('department', 'name code')
      .populate('programme', 'name code')
      .populate('room', 'roomNumber');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/users/:id', auth, authorize('superadmin', 'admin'), async (req, res) => {
  try {
    const { name, email, role, phoneNumber, department, programme, room, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, phoneNumber, department, programme, room, isActive },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;