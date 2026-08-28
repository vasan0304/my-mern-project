const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Department = require('../models/Department');

// Get system statistics
router.get('/stats', auth, authorize('superadmin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTickets = await Ticket.countDocuments();
    const pendingTickets = await Ticket.countDocuments({ status: 'pending' });
    const resolvedTickets = await Ticket.countDocuments({ status: 'resolved' });
    const departments = await Department.countDocuments();

    res.json({
      totalUsers,
      totalTickets,
      pendingTickets,
      resolvedTickets,
      departments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users with roles
router.get('/users', auth, authorize('superadmin'), async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('department programme room');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user role
router.put('/users/:id/role', auth, authorize('superadmin'), async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user
router.delete('/users/:id', auth, authorize('superadmin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;