const express = require('express');
const router = express.Router();
const Role = require('../models/Role');
const User = require('../models/User');
const { protect, superAdminOnly } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const roles = await Role.find().sort('roleName').lean();
    const users = await User.find().select('userName email role').lean();

    const rolesWithUsers = roles.map((role) => {
      const assigned = users.filter((u) => u.role && u.role.toString() === role._id.toString());
      return {
        ...role,
        assignedUsers: assigned.map((u) => u.userName).join(', ') || 'None',
        usersCount: assigned.length,
      };
    });

    res.json(rolesWithUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, superAdminOnly, async (req, res) => {
  try {
    const { roleName, assignedUser } = req.body;
    const role = await Role.create({ roleName });
    if (assignedUser) {
      await User.findByIdAndUpdate(assignedUser, { role: role._id });
    }
    res.status(201).json(role);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', protect, superAdminOnly, async (req, res) => {
  try {
    const { roleName, assignedUser } = req.body;
    const role = await Role.findByIdAndUpdate(req.params.id, { roleName }, { new: true });
    if (assignedUser) {
      await User.findByIdAndUpdate(assignedUser, { role: role._id });
    }
    res.json(role);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.delete('/:id', protect, superAdminOnly, async (req, res) => {
  await Role.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
