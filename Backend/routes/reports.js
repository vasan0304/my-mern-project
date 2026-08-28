const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { protect, superAdminOnly } = require('../middleware/auth');

router.get('/', protect, superAdminOnly, async (req, res) => {
  try {
    const { department, programme, complaintType, status, assignee } = req.query;
    const filter = {};

    if (department) filter.department = department;
    if (complaintType) filter.complaintType = complaintType;
    if (status) filter.status = status;
    if (assignee) filter.assignedTo = assignee;

    const complaints = await Complaint.find(filter)
      .populate('block').populate('room').populate('department')
      .populate('raisedBy', '-password').populate('assignedTo', '-password')
      .sort('-createdAt');

    // Filter by programme (through block)
    let result = complaints;
    if (programme) {
      result = complaints.filter(c => c.block?.programme?.toString() === programme);
    }

    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
