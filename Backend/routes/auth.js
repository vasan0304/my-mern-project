const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');

// POST /api/auth/register (SuperAdmin use via Postman)
router.post('/register', async (req, res) => {
  try {
    const { userName, phoneNumber, email, password, roleName, department, programme } = req.body;
    let role = await Role.findOne({ roleName });
    if (!role) {
      role = await Role.create({ roleName });
    }
    const user = await User.create({ userName, phoneNumber, email, password, role: role._id, department, programme });
    res.status(201).json({ message: 'User created', userId: user._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('role').populate('department').populate('programme');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.json({
      token,
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        department: user.department,
        programme: user.programme
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
